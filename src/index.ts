export { IGESLoader, type IGESLoaderOptions } from "./IGESLoader.js";
export { toThreeGroup, type ToThreeOptions } from "./three/toThree.js";

// Re-export iges-core for advanced consumers (R3F, custom pipelines)
export {
  parseIGES,
  parseAndResolveIGES,
  resolveReferences,
  IGESParseError,
  ENTITY_DECODERS,
  GEOMETRY_ENTITY_TYPES,
} from "iges-core";

export type {
  IGESModel,
  ResolvedIGESModel,
  GeometryEntity,
  GlobalSection,
  DirectoryEntry,
  RawEntity,
  PointGeometry,
  LineGeometry,
  CircularArcGeometry,
  PolylineGeometry,
  NurbsCurveGeometry,
} from "iges-core";
