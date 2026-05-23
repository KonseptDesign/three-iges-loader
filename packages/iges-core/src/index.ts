/**
 * iges-core — IGES 5.3 parser and geometry model (no rendering dependencies).
 * @packageDocumentation
 */

export { parseIGES, parseAndResolveIGES, type ParseIGESOptions } from "./parse/parseIGES.js";
export { resolveReferences } from "./resolve/resolveReferences.js";
export { splitSections } from "./parse/sections.js";
export { parseGlobalSection } from "./parse/parseGlobal.js";
export { parseDirectorySection } from "./parse/parseDirectory.js";
export { ENTITY_DECODERS, GEOMETRY_ENTITY_TYPES, META_ENTITY_TYPES } from "./entities/registry.js";
export { IGESParseError } from "./errors.js";
export { parseHollerith, parseIgesReal, parseIgesInt } from "./parse/hollerith.js";
export { sampleNurbsCurve, evaluateRationalBSpline } from "./math/nurbs.js";

export type {
  SectionId,
  ParamValue,
  PointerValue,
  GlobalSection,
  TerminateSection,
  DirectoryEntry,
  RawEntity,
  IGESModel,
  ResolvedIGESModel,
  Vec3,
  Transform3D,
  GeometryKind,
  GeometryEntity,
  PointGeometry,
  LineGeometry,
  CircularArcGeometry,
  PolylineGeometry,
  NurbsCurveGeometry,
  UnsupportedGeometry,
} from "./types.js";

export { IDENTITY_TRANSFORM, isPointer } from "./types.js";
