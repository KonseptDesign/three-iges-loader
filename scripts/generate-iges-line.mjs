#!/usr/bin/env node
/**
 * Helper to emit a valid 80-column IGES line.
 * Usage: node scripts/generate-iges-line.mjs "116,1.,2.,3.;" P 1
 */

const [content, section, seqStr] = process.argv.slice(2);
if (!content || !section || !seqStr) {
  console.error("Usage: generate-iges-line.mjs <content> <S|G|D|P|T> <sequence>");
  process.exit(1);
}

const seq = parseInt(seqStr, 10);
if (content.length > 72) {
  console.error(`Content exceeds 72 columns (${content.length})`);
  process.exit(1);
}

const line = content.padEnd(72) + section + String(seq).padStart(7, "0");
console.log(line);
