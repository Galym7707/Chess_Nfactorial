import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "public", "stockfish");
mkdirSync(target, { recursive: true });

const candidates = [
  join(root, "node_modules", "stockfish.js"),
  join(root, "node_modules", "stockfish"),
];

const sourceRoot = candidates.find((candidate) => existsSync(candidate));

if (!sourceRoot) {
  console.warn("[stockfish] package not installed yet; skipping engine copy.");
  process.exit(0);
}

const files = readdirSync(sourceRoot, { recursive: true }).filter((entry) => {
  const name = String(entry).replace(/\\/g, "/");
  return /stockfish.*\.(js|wasm|nnue)$/i.test(name) && !name.includes("node_modules");
});

for (const file of files) {
  const from = join(sourceRoot, String(file));
  const to = join(target, String(file).split(/[\\/]/).pop() ?? String(file));
  copyFileSync(from, to);
}

console.log(`[stockfish] copied ${files.length} engine asset(s) to public/stockfish`);