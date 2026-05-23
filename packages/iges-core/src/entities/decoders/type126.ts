import { paramInt, paramNumber } from "../decodeContext.js";
import type { DecodeContext } from "../decodeContext.js";
import type { NurbsCurveGeometry } from "../../types.js";
import { vec3 } from "../../math/vec3.js";

/**
 * Rational B-Spline Curve (Type 126).
 * @see IGES 5.3 Table 126
 */
export function decodeType126(ctx: DecodeContext): NurbsCurveGeometry | null {
  const { entity, transform, warnings } = ctx;
  const p = entity.params;

  const K = paramInt(p, 0);
  const M = paramInt(p, 1);
  const N = 1 + K - M;
  const knotCount = N + 2 * M + 1;
  const weightStart = 7 + K + M;
  const controlStart = weightStart + K + 1;

  if (p.length < controlStart + 3 * (K + 1)) {
    warnings.push(`Type 126 DE ${entity.de.sequence}: insufficient parameters`);
    return null;
  }

  const knots: number[] = [];
  for (let i = 0; i < knotCount; i++) {
    knots.push(paramNumber(p, 6 + i));
  }

  const weights: number[] = [];
  for (let i = 0; i <= K; i++) {
    weights.push(paramNumber(p, weightStart + i, 1));
  }

  const controlPoints = [];
  for (let i = 0; i <= K; i++) {
    const base = controlStart + 3 * i;
    controlPoints.push(
      vec3(paramNumber(p, base), paramNumber(p, base + 1), paramNumber(p, base + 2))
    );
  }

  const t0Index = controlStart + 3 * (K + 1);
  const t0 = paramNumber(p, t0Index, knots[M] ?? 0);
  const t1 = paramNumber(p, t0Index + 1, knots[knots.length - M - 1] ?? 1);

  return {
    kind: "nurbsCurve",
    deSequence: entity.de.sequence,
    entityType: 126,
    form: entity.form,
    transform,
    colorNumber: entity.de.colorNumber,
    level: entity.de.level,
    degree: M,
    knots,
    weights,
    controlPoints,
    t0,
    t1,
  };
}
