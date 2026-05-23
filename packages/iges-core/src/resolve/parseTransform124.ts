import { paramNumber } from "../entities/decodeContext.js";
import type { RawEntity, Transform3D } from "../types.js";

/**
 * Transformation Matrix Entity (Type 124), Form 0.
 * ET = R·E + T — parameters R11…R33, T1…T3 per IGES 5.3.
 */
export function parseTransform124(entity: RawEntity): Transform3D {
  const p = entity.params;
  return {
    matrix: [
      paramNumber(p, 0, 1),
      paramNumber(p, 1, 0),
      paramNumber(p, 2, 0),
      paramNumber(p, 4, 0),
      paramNumber(p, 5, 1),
      paramNumber(p, 6, 0),
      paramNumber(p, 8, 0),
      paramNumber(p, 9, 0),
      paramNumber(p, 10, 1),
    ],
    translation: {
      x: paramNumber(p, 3),
      y: paramNumber(p, 7),
      z: paramNumber(p, 11),
    },
  };
}
