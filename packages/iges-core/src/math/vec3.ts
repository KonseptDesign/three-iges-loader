import type { Vec3 } from "../types.js";

export function vec3(x: number, y: number, z: number): Vec3 {
  return { x, y, z };
}

export function distance2D(a: Vec3, b: Vec3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}
