import { decodeEntity, GEOMETRY_ENTITY_TYPES, META_ENTITY_TYPES } from "../entities/registry.js";
import type { DecodeContext } from "../entities/decodeContext.js";
import { transformPoint, multiplyTransforms } from "../math/transform.js";
import { parseTransform124 } from "./parseTransform124.js";
import type { GeometryEntity, IGESModel, ResolvedIGESModel, Transform3D } from "../types.js";
import { IDENTITY_TRANSFORM } from "../types.js";

/**
 * Resolve transformation matrices and decode geometry entities.
 */
export function resolveReferences(model: IGESModel): ResolvedIGESModel {
  const warnings: string[] = [...model.warnings];
  const transformCache = new Map<number, Transform3D>();

  function resolveTransform(deSequence: number): Transform3D {
    if (deSequence === 0) return IDENTITY_TRANSFORM;
    const cached = transformCache.get(deSequence);
    if (cached) return cached;

    const raw = model.entities.get(deSequence);
    if (!raw) {
      warnings.push(`Missing transform entity at DE ${deSequence}`);
      return IDENTITY_TRANSFORM;
    }

    if (raw.type !== 124) {
      warnings.push(`DE ${deSequence} is not type 124 (got ${raw.type})`);
      return IDENTITY_TRANSFORM;
    }

    const local = parseTransform124(raw);
    const parentPtr = raw.de.transformationMatrixPointer;
    const world = parentPtr > 0 ? multiplyTransforms(resolveTransform(parentPtr), local) : local;

    transformCache.set(deSequence, world);
    return world;
  }

  const geometry: GeometryEntity[] = [];

  const sorted = [...model.entities.values()].sort((a, b) => a.de.sequence - b.de.sequence);

  for (const entity of sorted) {
    if (META_ENTITY_TYPES.has(entity.type)) continue;
    if (!GEOMETRY_ENTITY_TYPES.has(entity.type)) {
      if (entity.type !== 0) {
        warnings.push(`Skipped unsupported entity type ${entity.type} (DE ${entity.de.sequence})`);
      }
      continue;
    }

    const matrixPtr = entity.de.transformationMatrixPointer;
    const transform = matrixPtr > 0 ? resolveTransform(matrixPtr) : IDENTITY_TRANSFORM;

    const ctx: DecodeContext = { entity, transform, warnings };
    const decoded = decodeEntity(ctx);
    if (!decoded) continue;

    const items = Array.isArray(decoded) ? decoded : [decoded];
    for (const item of items) {
      geometry.push(applyWorldTransform(item));
    }
  }

  return {
    global: model.global,
    start: model.start,
    entities: model.entities,
    geometry,
    warnings,
  };
}

function applyWorldTransform(entity: GeometryEntity): GeometryEntity {
  const t = entity.transform;
  if (t === IDENTITY_TRANSFORM) return entity;

  switch (entity.kind) {
    case "point":
      return { ...entity, position: transformPoint(t, entity.position) };
    case "line":
      return {
        ...entity,
        start: transformPoint(t, entity.start),
        end: transformPoint(t, entity.end),
      };
    case "circularArc": {
      const center = transformPoint(t, entity.center);
      const start = transformPoint(t, entity.start);
      const end = transformPoint(t, entity.end);
      return {
        ...entity,
        center,
        start,
        end,
        transform: IDENTITY_TRANSFORM,
      };
    }
    case "polyline":
      return {
        ...entity,
        points: entity.points.map((p) => transformPoint(t, p)),
        transform: IDENTITY_TRANSFORM,
      };
    case "nurbsCurve":
      return {
        ...entity,
        controlPoints: entity.controlPoints.map((p) => transformPoint(t, p)),
        transform: IDENTITY_TRANSFORM,
      };
    default:
      return entity;
  }
}
