import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 140;

function entryLine(): string {
  return "I can charge any phone just by touching it, but only if it's already at 100%.";
}

function validate(line: string): void {
  if (line.trim().length === 0) throw new Error("entry line is empty");
  if (line.length > MAX_CHARS) throw new Error(`entry line exceeds ${MAX_CHARS} characters: got ${line.length}`);
  if (line.includes("\n") || line.includes("\r")) throw new Error("entry line must be a single line");
  if (line !== line.trim()) throw new Error("entry line must not have leading or trailing whitespace");
}

function main(): void {
  const line = entryLine();
  validate(line);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "out";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, line, "utf8");
  const written = readFileSync(outPath, "utf8");
  if (written !== line) throw new Error("read-back mismatch");
  const sha256 = createHash("sha256").update(written, "utf8").digest("hex");
  console.log(line);
  console.log(sha256);
}

main();
