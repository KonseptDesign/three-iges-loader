import type { DecodeContext } from "./decodeContext.js";
import { decodeType100 } from "./decoders/type100.js";
import { decodeType106 } from "./decoders/type106.js";
import { decodeType110 } from "./decoders/type110.js";
import { decodeType116 } from "./decoders/type116.js";
import { decodeType126 } from "./decoders/type126.js";
import type { GeometryEntity, UnsupportedGeometry } from "../types.js";

export type EntityDecoder = (ctx: DecodeContext) => GeometryEntity | GeometryEntity[] | null;

/**
 * Maps IGES entity type numbers to decoders.
 * Add new types here — see docs/ENTITY_IMPLEMENTATION.md
 */
export const ENTITY_DECODERS = new Map<number, EntityDecoder>([
  [100, decodeType100],
  [106, (ctx) => decodeType106(ctx)],
  [110, decodeType110],
  [116, decodeType116],
  [126, (ctx) => decodeType126(ctx)],
]);

export function decodeEntity(ctx: DecodeContext): GeometryEntity | GeometryEntity[] | null {
  const decoder = ENTITY_DECODERS.get(ctx.entity.type);
  if (!decoder) {
    return unsupported(ctx, `Entity type ${ctx.entity.type} is not implemented`);
  }
  return decoder(ctx);
}

function unsupported(ctx: DecodeContext, reason: string): UnsupportedGeometry {
  return {
    kind: "unsupported",
    deSequence: ctx.entity.de.sequence,
    entityType: ctx.entity.type,
    form: ctx.entity.form,
    transform: ctx.transform,
    colorNumber: ctx.entity.de.colorNumber,
    level: ctx.entity.de.level,
    reason,
  };
}

/** Entity types that produce renderable geometry (excludes 124, 402, etc.). */
export const GEOMETRY_ENTITY_TYPES = new Set([100, 106, 110, 116, 126]);

/** Meta entity types parsed but not emitted as geometry. */
export const META_ENTITY_TYPES = new Set([124, 314, 402, 406]);
