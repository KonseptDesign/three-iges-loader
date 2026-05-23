import { paramNumber } from "../decodeContext.js";
import type { DecodeContext } from "../decodeContext.js";
import type { LineGeometry } from "../../types.js";
import { vec3 } from "../../math/vec3.js";

/** Line Entity (Type 110) */
export function decodeType110(ctx: DecodeContext): LineGeometry {
  const { entity, transform } = ctx;
  const p = entity.params;

  return {
    kind: "line",
    deSequence: entity.de.sequence,
    entityType: 110,
    form: entity.form,
    transform,
    colorNumber: entity.de.colorNumber,
    level: entity.de.level,
    start: vec3(paramNumber(p, 0), paramNumber(p, 1), paramNumber(p, 2)),
    end: vec3(paramNumber(p, 3), paramNumber(p, 4), paramNumber(p, 5)),
  };
}
