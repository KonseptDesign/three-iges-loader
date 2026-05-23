import type { DirectoryEntry } from "../types.js";
import { IGESParseError } from "../errors.js";

const DE_RECORD_LENGTH = 160;

/**
 * Parse Directory Entry section (pairs of 80-column lines).
 */
export function parseDirectorySection(directoryText: string): DirectoryEntry[] {
  const entries: DirectoryEntry[] = [];
  const padded =
    directoryText.length % DE_RECORD_LENGTH === 0
      ? directoryText
      : directoryText.padEnd(
          directoryText.length + (DE_RECORD_LENGTH - (directoryText.length % DE_RECORD_LENGTH)),
          " "
        );

  for (let offset = 0; offset < padded.length; offset += DE_RECORD_LENGTH) {
    const block = padded.slice(offset, offset + DE_RECORD_LENGTH);
    if (block.trim().length === 0) continue;

    const line1 = block.slice(0, 80);
    const line2 = block.slice(80, 160);

    const sequence = parseDeSequence(line1);
    if (sequence === null) {
      throw new IGESParseError("Could not parse DE sequence number", {
        code: "INVALID_DE_SEQUENCE",
        context: line1.slice(64, 80),
      });
    }

    entries.push({
      sequence,
      entityType: parseIntField(line1, 0, 8),
      parameterDataPointer: parseIntField(line1, 8, 8),
      structure: parseIntField(line1, 16, 8),
      lineFontPattern: parseIntField(line1, 24, 8),
      level: parseIntField(line1, 32, 8),
      view: parseIntField(line1, 40, 8),
      transformationMatrixPointer: parseIntField(line1, 48, 8),
      labelDisplayAssociativity: parseIntField(line1, 56, 8),
      statusNumber: parseIntField(line1, 64, 8),
      lineWeight: parseIntField(line2, 8, 8),
      colorNumber: parseIntField(line2, 16, 8),
      parameterLineCount: parseIntField(line2, 24, 8),
      formNumber: parseIntField(line2, 32, 8),
      entityLabel: line2.slice(64, 72).trim(),
      entitySubscript: parseIntField(line2, 72, 8),
    });
  }

  return entries;
}

function parseIntField(line: string, start: number, length: number): number {
  const raw = line.slice(start, start + length).trim();
  if (raw.length === 0) return 0;
  const value = parseInt(raw, 10);
  return Number.isFinite(value) ? value : 0;
}

/**
 * Extract DE sequence from columns 74–80 (7-digit sequence after section letter in col 73).
 * Supports modern `…D0000001` and legacy `…D      1` layouts.
 */
function parseDeSequence(line: string): number | null {
  const padded = line.padEnd(80, " ");
  const sectionChar = padded[72];
  if (sectionChar !== "D" && sectionChar !== "d") {
    return null;
  }
  const seqStr = padded.slice(73, 80).trim();
  const seq = parseInt(seqStr, 10);
  return Number.isFinite(seq) && seq > 0 ? seq : null;
}

export function validateDirectoryCounts(
  entries: DirectoryEntry[],
  directoryLineCount: number
): void {
  if (directoryLineCount > 0 && entries.length !== directoryLineCount / 2) {
    throw new IGESParseError(
      `Directory entity count mismatch: expected ${directoryLineCount / 2}, got ${entries.length}`,
      { code: "DE_COUNT_MISMATCH" }
    );
  }
}
