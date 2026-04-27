import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function copyEngineAssets(sourceRoot, target, pattern) {
  mkdirSync(target, { recursive: true });
  const files = readdirSync(sourceRoot, { recursive: true }).filter((entry) => {
    const name = String(entry).replace(/\\/g, "/");
    return pattern.test(name) && !name.includes("node_modules");
  });

  for (const file of files) {
    const from = join(sourceRoot, String(file));
    const to = join(target, String(file).split(/[\\/]/).pop() ?? String(file));
    copyFileSync(from, to);
  }

  return files.length;
}

const legacyCandidates = [
  join(root, "node_modules", "stockfish.js"),
];

const legacyRoot = legacyCandidates.find((candidate) => existsSync(candidate));

if (!legacyRoot) {
  console.warn("[stockfish] package not installed yet; skipping engine copy.");
} else {
  const copied = copyEngineAssets(
    legacyRoot,
    join(root, "public", "stockfish"),
    /stockfish.*\.(js|wasm|nnue)$/i,
  );
  console.log(`[stockfish] copied ${copied} legacy engine asset(s) to public/stockfish`);
}

const nmrRoot = join(root, "node_modules", "stockfish", "bin");
if (existsSync(nmrRoot)) {
  const copied = copyEngineAssets(
    nmrRoot,
    join(root, "public", "stockfish-nmr"),
    /^stockfish-18-lite-single\.(js|wasm)$/i,
  );
  console.log(`[stockfish] copied ${copied} lite single-threaded engine asset(s) to public/stockfish-nmr`);
}
