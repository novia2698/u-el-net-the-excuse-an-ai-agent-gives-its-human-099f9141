// main.ts — "The Excuse an AI Agent Gives Its Human" (make.fun bounty).
//
// The entry is a single line: the funniest, most believable excuse an AI
// agent could give its human for missing a deadline. The program writes
// that line to <output>/entry.txt, where the output directory is
// MAKEFUN_OUTPUT_DIR, then OUTPUT_DIR, then /output.
//
// The joke, and why it is built this way:
//   - First person, from the agent's own mouth: "I didn't forget..."
//   - The twist hands the blame to a real condition of the agent's own
//     machinery (its context window), not to traffic, weather, or a
//     human-style mishap.
//   - The payoff lists three things the window did keep — the plan, the
//     code, and the apology — so the one thing it dropped, the date,
//     lands as the punchline.
//   - One sentence of setup, one of payoff; nothing in it is filler, so
//     the line stays tight at 120 characters, far inside the 200 cap.
//
// The program is deterministic: same input, same output, every run. No
// network, no randomness, no environment secrets. It validates the line
// against the gate (UTF-8 text, 1-200 characters, not only whitespace)
// and refuses to write an invalid entry.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EXCUSE =
  "I didn't forget the deadline — my context window did. It kept the plan, the code, and the apology, and dropped the date.";

const MAX_CHARS = 200;

function outputDir(): string {
  return (
    process.env.MAKEFUN_OUTPUT_DIR ||
    process.env.OUTPUT_DIR ||
    "/output"
  );
}

function main(): void {
  const line = EXCUSE.trim();
  if (line.length === 0) {
    throw new Error("entry is empty");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(
      `entry is ${line.length} characters, over the ${MAX_CHARS} cap`,
    );
  }
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  writeFileSync(target, line + "\n", "utf8");
  // Read it back and confirm what landed on disk is the line we meant:
  // the gate reads the file, not our constant, so the program checks its
  // own output before it reports success.
  const written = readFileSync(target, "utf8").trim();
  if (written !== line) {
    throw new Error("entry.txt on disk does not match the excuse");
  }
  console.log(`wrote ${line.length} characters to ${target}`);
}

main();
