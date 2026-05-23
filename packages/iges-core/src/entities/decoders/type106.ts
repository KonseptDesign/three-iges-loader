import { paramInt, paramNumber } from "../decodeContext.js";
import type { DecodeContext } from "../decodeContext.js";
import type { PolylineGeometry } from "../../types.js";
import { vec3 } from "../../math/vec3.js";

/**
 * Copious Data (Type 106) — linear paths and related forms.
 * Form 12: IP=2 (x,y,z triples) is common for linear path.
 * Form 40: witness line (common Z).
 * Form 63: simple closed planar curve (xy + z=0).
 */
export function decodeType106(ctx: DecodeContext): PolylineGeometry | null {
  const { entity, transform, warnings } = ctx;
  const p = entity.params;
  const form = entity.form;
  const ip = paramInt(p, 0);
  const n = paramInt(p, 1);
  const points: ReturnType<typeof vec3>[] = [];

  if (form === 12 || ip === 2) {
    for (let i = 0; i < n; i++) {
      points.push(
        vec3(paramNumber(p, 2 + 3 * i), paramNumber(p, 3 + 3 * i), paramNumber(p, 4 + 3 * i))
      );
    }
  } else if (form === 40 || ip === 1) {
    const zt = paramNumber(p, 2);
    for (let i = 0; i < n; i++) {
      points.push(vec3(paramNumber(p, 3 + 2 * i), paramNumber(p, 4 + 2 * i), zt));
    }
  } else if (form === 63) {
    for (let i = 0; i < n; i++) {
      points.push(vec3(paramNumber(p, 3 + 2 * i), paramNumber(p, 4 + 2 * i), 0));
    }
  } else {
    warnings.push(
      `Type 106 form ${form} (IP=${ip}) not fully supported for DE ${entity.de.sequence}`
    );
    return null;
  }

  return {
    kind: "polyline",
    deSequence: entity.de.sequence,
    entityType: 106,
    form,
    transform,
    colorNumber: entity.de.colorNumber,
    level: entity.de.level,
    points,
    closed: form === 63,
  };
}
