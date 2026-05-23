/**
 * Hollerith strings: <count>H<text>  e.g. 4HSLOT
 */

export function parseHollerith(str: string): string | undefined {
  const hIndex = str.indexOf("H");
  if (hIndex <= 0) return undefined;

  const countStr = str.slice(0, hIndex);
  const count = parseInt(countStr, 10);
  if (!Number.isFinite(count) || count < 0) return undefined;

  return str.slice(hIndex + 1, hIndex + 1 + count);
}

/** If the token is Hollerith-encoded, return decoded text; otherwise return as-is. */
export function decodeHollerithToken(token: string): string {
  const decoded = parseHollerith(token.trim());
  return decoded ?? token.trim();
}

/** IGES real numbers may use Fortran-style D exponents. */
export function parseIgesReal(token: string): number {
  const normalized = token.trim().replace(/[Dd]/g, "e");
  const value = parseFloat(normalized);
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid IGES real: "${token}"`);
  }
  return value;
}

export function parseIgesInt(token: string): number {
  const value = parseInt(token.trim(), 10);
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid IGES integer: "${token}"`);
  }
  return value;
}
