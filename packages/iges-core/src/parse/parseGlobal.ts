import { decodeHollerithToken } from "./hollerith.js";
import { parseHollerith, parseIgesInt, parseIgesReal } from "./hollerith.js";
import { splitParameterRecords, tokenizeFields } from "./paramTokenizer.js";
import type { GlobalSection } from "../types.js";

/**
 * Parse concatenated Global section text.
 * @see IGES 5.3 Section 3.3.2
 */
export function parseGlobalSection(raw: string): GlobalSection {
  let fieldDelimiter = ",";
  let recordDelimiter = ";";
  let body = raw;

  if (raw.length > 0 && raw[0] !== fieldDelimiter) {
    const first = extractLeadingHollerith(raw);
    if (first) {
      fieldDelimiter = first.value || ",";
      body = first.rest;
    }
  }

  const records = splitParameterRecords(body, recordDelimiter);
  const firstRecord = records[0] ?? body;
  const fields = tokenizeFields(firstRecord, fieldDelimiter);

  if (fields.length > 1) {
    const second = fields[1];
    if (second !== undefined) {
      const decoded = parseHollerith(second.trim());
      if (decoded !== undefined) {
        recordDelimiter = decoded;
      }
    }
  }

  // Re-tokenize full body with known delimiters
  const allRecords = splitParameterRecords(body, recordDelimiter);
  const globalRecord = allRecords[0] ?? body;
  const tokens = tokenizeFields(globalRecord, fieldDelimiter);

  const str = (index: number, fallback = ""): string => {
    const t = tokens[index];
    if (t === undefined) return fallback;
    return decodeHollerithToken(t);
  };

  const num = (index: number, fallback = 0): number => {
    const t = tokens[index];
    if (t === undefined) return fallback;
    try {
      return parseIgesReal(t);
    } catch {
      return fallback;
    }
  };

  const int = (index: number, fallback = 0): number => {
    const t = tokens[index];
    if (t === undefined) return fallback;
    try {
      return parseIgesInt(t);
    } catch {
      return fallback;
    }
  };

  return {
    fieldDelimiter,
    recordDelimiter,
    productIdFromSender: str(2),
    fileName: str(3),
    nativeSystemId: str(4),
    preprocessorVersion: str(5),
    integerBits: int(6),
    singleMaxPowerOfTen: num(7),
    singleSignificandDigits: num(8),
    doubleMaxPowerOfTen: num(9),
    doubleSignificandDigits: num(10),
    productIdForReceiver: str(11),
    modelSpaceScale: num(12, 1),
    unitsFlag: int(13),
    unitsName: str(14),
    maxLineWeightGradations: num(15),
    maxLineWeight: num(16),
    createdAt: str(17),
    minimumResolution: num(18),
    approximateMaxCoordinate: num(19),
    author: str(20),
    organization: str(21),
    igesVersion: int(22),
    draftingStandard: int(23),
    lastModifiedAt: str(24),
    raw,
  };
}

function extractLeadingHollerith(raw: string): { value: string; rest: string } | null {
  const hIndex = raw.indexOf("H");
  if (hIndex <= 0) return null;
  const count = parseInt(raw.slice(0, hIndex), 10);
  if (!Number.isFinite(count)) return null;
  const value = raw.slice(hIndex + 1, hIndex + 1 + count);
  const rest = raw.slice(hIndex + 1 + count);
  // Skip field delimiter after hollerith if present
  const trimmed = rest.startsWith(",") || rest.startsWith(";") ? rest.slice(1) : rest;
  return { value, rest: trimmed };
}
