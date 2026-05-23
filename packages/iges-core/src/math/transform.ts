import type { Transform3D, Vec3 } from "../types.js";

export function transformPoint(t: Transform3D, p: Vec3): Vec3 {
  const [r11, r12, r13, r21, r22, r23, r31, r32, r33] = t.matrix;
  return {
    x: r11 * p.x + r12 * p.y + r13 * p.z + t.translation.x,
    y: r21 * p.x + r22 * p.y + r23 * p.z + t.translation.y,
    z: r31 * p.x + r32 * p.y + r33 * p.z + t.translation.z,
  };
}

export function multiplyTransforms(parent: Transform3D, local: Transform3D): Transform3D {
  const [a11, a12, a13, a21, a22, a23, a31, a32, a33] = parent.matrix;
  const [b11, b12, b13, b21, b22, b23, b31, b32, b33] = local.matrix;

  const matrix: Transform3D["matrix"] = [
    a11 * b11 + a12 * b21 + a13 * b31,
    a11 * b12 + a12 * b22 + a13 * b32,
    a11 * b13 + a12 * b23 + a13 * b33,
    a21 * b11 + a22 * b21 + a23 * b31,
    a21 * b12 + a22 * b22 + a23 * b32,
    a21 * b13 + a22 * b23 + a23 * b33,
    a31 * b11 + a32 * b21 + a33 * b31,
    a31 * b12 + a32 * b22 + a33 * b32,
    a31 * b13 + a32 * b23 + a33 * b33,
  ];

  const translation = transformPoint(parent, local.translation);

  return { matrix, translation };
}

export function transformDirection(t: Transform3D, d: Vec3): Vec3 {
  const [r11, r12, r13, r21, r22, r23, r31, r32, r33] = t.matrix;
  return {
    x: r11 * d.x + r12 * d.y + r13 * d.z,
    y: r21 * d.x + r22 * d.y + r23 * d.z,
    z: r31 * d.x + r32 * d.y + r33 * d.z,
  };
}
