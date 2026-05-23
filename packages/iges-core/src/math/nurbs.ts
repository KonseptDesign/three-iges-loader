import type { Vec3 } from "../types.js";

/**
 * Evaluate rational B-spline curve at parameter t (de Boor).
 * @see IGES Type 126
 */
export function evaluateRationalBSpline(
  degree: number,
  knots: number[],
  weights: number[],
  controlPoints: Vec3[],
  t: number
): Vec3 {
  const n = controlPoints.length - 1;
  if (n < degree) {
    return controlPoints[0] ?? { x: 0, y: 0, z: 0 };
  }

  // Find knot span
  const span = findSpan(n, degree, t, knots);

  const d: Vec3[] = [];
  const dw: number[] = [];

  for (let j = 0; j <= degree; j++) {
    const i = span - degree + j;
    const cp = controlPoints[i] ?? controlPoints[controlPoints.length - 1]!;
    const w = weights[i] ?? 1;
    d[j] = { x: cp.x * w, y: cp.y * w, z: cp.z * w };
    dw[j] = w;
  }

  for (let r = 1; r <= degree; r++) {
    for (let j = degree; j >= r; j--) {
      const i = span - degree + j;
      const denom = knots[i + degree + 1 - r]! - knots[i]!;
      const alpha = denom === 0 ? 0 : (t - knots[i]!) / denom;
      const idx = j;
      const prev = j - 1;
      d[idx] = {
        x: (1 - alpha) * d[prev]!.x + alpha * d[idx]!.x,
        y: (1 - alpha) * d[prev]!.y + alpha * d[idx]!.y,
        z: (1 - alpha) * d[prev]!.z + alpha * d[idx]!.z,
      };
      dw[idx] = (1 - alpha) * dw[prev]! + alpha * dw[idx]!;
    }
  }

  const w = dw[degree]!;
  if (w === 0) return controlPoints[0] ?? { x: 0, y: 0, z: 0 };
  return {
    x: d[degree]!.x / w,
    y: d[degree]!.y / w,
    z: d[degree]!.z / w,
  };
}

function findSpan(n: number, degree: number, t: number, knots: number[]): number {
  if (t >= knots[n + 1]!) return n;
  if (t <= knots[degree]!) return degree;
  let low = degree;
  let high = n + 1;
  let mid = Math.floor((low + high) / 2);
  while (t < knots[mid]! || t >= knots[mid + 1]!) {
    if (t < knots[mid]!) high = mid;
    else low = mid;
    mid = Math.floor((low + high) / 2);
  }
  return mid;
}

/** Sample a NURBS curve into a polyline. */
export function sampleNurbsCurve(
  degree: number,
  knots: number[],
  weights: number[],
  controlPoints: Vec3[],
  t0: number,
  t1: number,
  segments: number
): Vec3[] {
  const points: Vec3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = t0 + (t1 - t0) * (i / segments);
    points.push(evaluateRationalBSpline(degree, knots, weights, controlPoints, t));
  }
  return points;
}
