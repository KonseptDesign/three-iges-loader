import { paramNumber } from "../decodeContext.js";
import type { DecodeContext } from "../decodeContext.js";
import type { PointGeometry } from "../../types.js";
import { vec3 } from "../../math/vec3.js";

/** Point Entity (Type 116) */
export function decodeType116(ctx: DecodeContext): PointGeometry {
  const { entity, transform } = ctx;
  const p = entity.params;

  return {
    kind: "point",
    deSequence: entity.de.sequence,
    entityType: 116,
    form: entity.form,
    transform,
    colorNumber: entity.de.colorNumber,
    level: entity.de.level,
    position: vec3(paramNumber(p, 0), paramNumber(p, 1), paramNumber(p, 2)),
  };
}
