import { paramNumber } from "../decodeContext.js";
import type { DecodeContext } from "../decodeContext.js";
import type { CircularArcGeometry } from "../../types.js";
import { distance2D, vec3 } from "../../math/vec3.js";

/** Circular Arc Entity (Type 100) */
export function decodeType100(ctx: DecodeContext): CircularArcGeometry {
  const { entity, transform } = ctx;
  const p = entity.params;

  const zt = paramNumber(p, 0);
  const center = vec3(paramNumber(p, 1), paramNumber(p, 2), zt);
  const start = vec3(paramNumber(p, 3), paramNumber(p, 4), zt);
  const end = vec3(paramNumber(p, 5), paramNumber(p, 6), zt);
  const radius = distance2D(center, start);

  return {
    kind: "circularArc",
    deSequence: entity.de.sequence,
    entityType: 100,
    form: entity.form,
    transform,
    colorNumber: entity.de.colorNumber,
    level: entity.de.level,
    zDisplacement: zt,
    center,
    start,
    end,
    radius,
  };
}
