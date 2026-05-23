import type { ParamValue, RawEntity, Transform3D } from "../types.js";
import { isPointer } from "../types.js";

export interface DecodeContext {
  entity: RawEntity;
  /** Resolved world transform for this entity (before local geometry). */
  transform: Transform3D;
  warnings: string[];
}

export function paramNumber(params: ParamValue[], index: number, fallback = 0): number {
  const value = params[index];
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = parseFloat(value.replace(/[Dd]/g, "e"));
    return Number.isFinite(n) ? n : fallback;
  }
  if (value && isPointer(value)) return value.deSequence;
  return fallback;
}

export function paramInt(params: ParamValue[], index: number, fallback = 0): number {
  return Math.trunc(paramNumber(params, index, fallback));
}
