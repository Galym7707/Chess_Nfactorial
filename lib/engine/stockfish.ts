export type EngineLimit = {
  depth?: number;
  movetime?: number;
  skill?: number;
};

export type EngineAnalysis = {
  bestMove: string | null;
  ponder?: string;
  scoreCp: number;
  mate?: number;
  depth: number;
  pv: string[];
  raw: string[];
};

type Waiter = {
  match: (line: string) => boolean;
  resolve: () => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
};

type PendingSearch = {
  resolve: (analysis: EngineAnalysis) => void;
  timer: ReturnType<typeof setTimeout>;
  latest: EngineAnalysis;
};

type EngineScript = {
  url: string;
  type?: WorkerType;
};

const fallbackAnalysis: EngineAnalysis = {
  bestMove: null,
  scoreCp: 0,
  depth: 0,
  pv: [],
  raw: [],
};

const liteSingleEngineScript: EngineScript = { url: "/stockfish-nmr/stockfish-18-lite-single.js" };
const legacyEngineScripts: EngineScript[] = [{ url: "/stockfish/stockfish.wasm.js" }, { url: "/stockfish/stockfish.js" }];

export class StockfishClient {
  private worker: Worker | null = null;
  private waiters: Waiter[] = [];
  private pending: PendingSearch | null = null;
  private initialized: Promise<void> | null = null;
  private queue: Promise<EngineAnalysis> = Promise.resolve(fallbackAnalysis);
  private activeScript = "";

  init() {
    if (this.initialized) return this.initialized;
    this.initialized = this.initialize();
    return this.initialized;
  }

  analyzeFen(fen: string, limit: EngineLimit = {}) {
    this.queue = this.queue.catch(() => fallbackAnalysis).then(() => this.search(fen, limit));
    return this.queue;
  }

  dispose() {
    if (this.pending) {
      clearTimeout(this.pending.timer);
      this.pending.resolve(this.pending.latest);
      this.pending = null;
    }
    this.waiters.forEach((waiter) => clearTimeout(waiter.timer));
    this.waiters = [];
    this.worker?.terminate();
    this.worker = null;
    this.initialized = null;
    this.activeScript = "";
  }

  private async initialize() {
    const scripts = this.getEngineScripts();
    let lastError: Error | null = null;

    for (const script of scripts) {
      try {
        this.resetWorker();
        this.ensureWorker(script);
        this.post("uci");
        await this.waitFor((line) => line === "uciok", 25000);
        this.post("setoption name Threads value 1");
        this.post("setoption name Hash value 32");
        this.post("isready");
        await this.waitFor((line) => line === "readyok", 12000);
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Stockfish init failed");
        this.resetWorker();
      }
    }

    this.initialized = null;
    throw lastError ?? new Error("Stockfish init failed");
  }

  private getEngineScripts() {
    return typeof WebAssembly === "object" ? [liteSingleEngineScript, ...legacyEngineScripts] : [{ url: "/stockfish/stockfish.js" }];
  }

  private ensureWorker(script: EngineScript) {
    if (this.worker) return;
    this.activeScript = script.url;
    this.worker = new Worker(script.url, script.type ? { type: script.type } : undefined);
    this.worker.addEventListener("message", (event: MessageEvent<string>) => this.handleLine(String(event.data)));
    this.worker.addEventListener("error", () => this.rejectWaiters(new Error(`Stockfish worker failed: ${this.activeScript}`)));
  }

  private post(command: string) {
    this.worker?.postMessage(command);
  }

  private waitFor(match: (line: string) => boolean, timeoutMs: number) {
    return new Promise<void>((resolve, reject) => {
      const waiter: Waiter = {
        match,
        resolve,
        reject,
        timer: setTimeout(() => {
          this.waiters = this.waiters.filter((item) => item !== waiter);
          reject(new Error("Stockfish timeout"));
        }, timeoutMs),
      };
      this.waiters.push(waiter);
    });
  }

  private rejectWaiters(error: Error) {
    for (const waiter of this.waiters) {
      clearTimeout(waiter.timer);
      waiter.reject(error);
    }
    this.waiters = [];

    if (this.pending) {
      clearTimeout(this.pending.timer);
      this.pending.resolve(this.pending.latest);
      this.pending = null;
    }
  }

  private resetWorker() {
    this.waiters.forEach((waiter) => clearTimeout(waiter.timer));
    this.waiters = [];
    if (this.pending) {
      clearTimeout(this.pending.timer);
      this.pending.resolve(this.pending.latest);
      this.pending = null;
    }
    this.worker?.terminate();
    this.worker = null;
    this.activeScript = "";
  }

  private async search(fen: string, limit: EngineLimit) {
    await this.init();
    if (typeof limit.skill === "number") this.post(`setoption name Skill Level value ${limit.skill}`);
    this.post("ucinewgame");
    this.post(`position fen ${fen}`);

    return new Promise<EngineAnalysis>((resolve) => {
      const timer = setTimeout(() => {
        this.post("stop");
        if (this.pending) {
          const latest = this.pending.latest;
          this.pending = null;
          resolve(latest);
        }
      }, limit.depth ? Math.max(limit.depth * 1500, 12000) : Math.max((limit.movetime ?? 800) + 5000, 7000));

      this.pending = {
        resolve: (analysis) => {
          clearTimeout(timer);
          resolve(analysis);
        },
        timer,
        latest: { ...fallbackAnalysis, raw: [] },
      };

      if (limit.depth) this.post(`go depth ${limit.depth}`);
      else this.post(`go movetime ${limit.movetime ?? 700}`);
    });
  }

  private handleLine(line: string) {
    if (line.startsWith("stockfish-error ")) {
      this.rejectWaiters(new Error(line.replace("stockfish-error ", "")));
      return;
    }

    for (const waiter of [...this.waiters]) {
      if (waiter.match(line)) {
        clearTimeout(waiter.timer);
        this.waiters = this.waiters.filter((item) => item !== waiter);
        waiter.resolve();
      }
    }

    if (!this.pending) return;
    this.pending.latest.raw.push(line);

    if (line.startsWith("info ")) {
      const depth = /\bdepth\s+(\d+)/.exec(line)?.[1];
      const score = /\bscore\s+(cp|mate)\s+(-?\d+)/.exec(line);
      const pv = /\bpv\s+(.+)$/.exec(line)?.[1];
      if (depth) this.pending.latest.depth = Number(depth);
      if (score) {
        if (score[1] === "mate") {
          this.pending.latest.mate = Number(score[2]);
          this.pending.latest.scoreCp = Number(score[2]) > 0 ? 10000 : -10000;
        } else {
          this.pending.latest.scoreCp = Number(score[2]);
          this.pending.latest.mate = undefined;
        }
      }
      if (pv) this.pending.latest.pv = pv.split(" ").slice(0, 6);
    }

    const best = /^bestmove\s+(\S+)(?:\s+ponder\s+(\S+))?/.exec(line);
    if (best) {
      const analysis = { ...this.pending.latest, bestMove: best[1] === "(none)" ? null : best[1], ponder: best[2] };
      const resolve = this.pending.resolve;
      clearTimeout(this.pending.timer);
      this.pending = null;
      resolve(analysis);
    }
  }
}

export function normalizeScoreForMover(before: EngineAnalysis, after: EngineAnalysis) {
  return before.scoreCp - -after.scoreCp;
}
