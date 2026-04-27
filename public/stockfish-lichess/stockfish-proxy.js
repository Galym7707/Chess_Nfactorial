import Stockfish from "/stockfish-lichess/sf_18_smallnet.js";

let engine = null;
const queuedCommands = [];

function emit(line) {
  postMessage(String(line));
}

function reportError(error) {
  const message = error instanceof Error ? error.message : String(error);
  emit(`stockfish-error ${message}`);
}

function flushQueue() {
  if (!engine) return;
  while (queuedCommands.length) engine.uci(queuedCommands.shift());
}

self.onmessage = (event) => {
  const command = String(event.data);
  if (engine) {
    engine.uci(command);
    return;
  }
  queuedCommands.push(command);
};

Stockfish({
  locateFile: (file) => `/stockfish-lichess/${file}`,
  mainScriptUrlOrBlob: "/stockfish-lichess/sf_18_smallnet.js",
})
  .then((instance) => {
    engine = instance;
    engine.listen = emit;
    engine.onError = reportError;
    flushQueue();
  })
  .catch(reportError);
