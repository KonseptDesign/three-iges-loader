/**
 * Core IGES domain types.
 * @see docs/ARCHITECTURE.md
 * @see docs/ENTITY_IMPLEMENTATION.md
 */

/** IGES file section identifiers (column 73). */
export type SectionId = "S" | "G" | "D" | "P" | "T";

/** Parsed value from a parameter-data field. */
export type ParamValue = number | string | PointerValue;

/** Reference to another entity by Directory Entry sequence number (always odd). */
export interface PointerValue {
  readonly kind: "pointer";
  readonly deSequence: number;
}

export function isPointer(value: ParamValue): value is PointerValue {
  return typeof value === "object" && value !== null && value.kind === "pointer";
}

/** Global (G) section — preprocessor / file metadata. */
export interface GlobalSection {
  fieldDelimiter: string;
  recordDelimiter: string;
  productIdFromSender: string;
  fileName: string;
  nativeSystemId: string;
  preprocessorVersion: string;
  integerBits: number;
  singleMaxPowerOfTen: number;
  singleSignificandDigits: number;
  doubleMaxPowerOfTen: number;
  doubleSignificandDigits: number;
  productIdForReceiver: string;
  modelSpaceScale: number;
  unitsFlag: number;
  unitsName: string;
  maxLineWeightGradations: number;
  maxLineWeight: number;
  createdAt: string;
  minimumResolution: number;
  approximateMaxCoordinate: number;
  author: string;
  organization: string;
  igesVersion: number;
  draftingStandard: number;
  lastModifiedAt: string;
  /** Raw G-section text after concatenation (debug). */
  raw: string;
}

/** Terminate (T) section line counts. */
export interface TerminateSection {
  startLineCount: number;
  globalLineCount: number;
  directoryLineCount: number;
  parameterLineCount: number;
}

/**
 * Directory Entry (DE) — two 80-column records per entity.
 * Field positions follow IGES 5.3 Tables 1–2.
 */
export interface DirectoryEntry {
  /** Odd DE sequence number (1, 3, 5, …). */
  sequence: number;
  entityType: number;
  /** Pointer to first P-section record for this entity. */
  parameterDataPointer: number;
  structure: number;
  lineFontPattern: number;
  level: number;
  view: number;
  transformationMatrixPointer: number;
  labelDisplayAssociativity: number;
  statusNumber: number;
  lineWeight: number;
  colorNumber: number;
  parameterLineCount: number;
  formNumber: number;
  entityLabel: string;
  entitySubscript: number;
}

/** Raw entity before geometry decoding. */
export interface RawEntity {
  de: DirectoryEntry;
  /** Entity type from first PD field (should match DE). */
  type: number;
  form: number;
  params: ParamValue[];
  /** Unparsed parameter string (without trailing record delimiter). */
  rawParameter: string;
}

// --- Resolved geometry (display-neutral) ---

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Transform3D {
  /** 3×3 rotation (row-major: R11,R12,R13, R21,…). */
  matrix: [number, number, number, number, number, number, number, number, number];
  translation: Vec3;
}

export const IDENTITY_TRANSFORM: Transform3D = {
  matrix: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  translation: { x: 0, y: 0, z: 0 },
};

export type GeometryKind =
  | "point"
  | "line"
  | "circularArc"
  | "polyline"
  | "nurbsCurve"
  | "unsupported";

export interface BaseGeometry {
  kind: GeometryKind;
  deSequence: number;
  entityType: number;
  form: number;
  /** World transform after resolving DE matrix pointer chain. */
  transform: Transform3D;
  colorNumber: number;
  level: number;
}

export interface PointGeometry extends BaseGeometry {
  kind: "point";
  position: Vec3;
}

export interface LineGeometry extends BaseGeometry {
  kind: "line";
  start: Vec3;
  end: Vec3;
}

export interface CircularArcGeometry extends BaseGeometry {
  kind: "circularArc";
  /** Arc plane offset ZT (displacement along Z). */
  zDisplacement: number;
  center: Vec3;
  start: Vec3;
  end: Vec3;
  /** Computed radius from center to start. */
  radius: number;
}

export interface PolylineGeometry extends BaseGeometry {
  kind: "polyline";
  points: Vec3[];
  closed: boolean;
}

export interface NurbsCurveGeometry extends BaseGeometry {
  kind: "nurbsCurve";
  degree: number;
  knots: number[];
  weights: number[];
  controlPoints: Vec3[];
  /** Parameter range for evaluation. */
  t0: number;
  t1: number;
}

export interface UnsupportedGeometry extends BaseGeometry {
  kind: "unsupported";
  reason: string;
}

export type GeometryEntity =
  | PointGeometry
  | LineGeometry
  | CircularArcGeometry
  | PolylineGeometry
  | NurbsCurveGeometry
  | UnsupportedGeometry;

/** Parsed file before reference resolution. */
export interface IGESModel {
  start: string;
  global: GlobalSection;
  entities: Map<number, RawEntity>;
  terminate: TerminateSection;
  warnings: string[];
}

/** Model after pointer + transform resolution. */
export interface ResolvedIGESModel {
  global: GlobalSection;
  start: string;
  entities: Map<number, RawEntity>;
  geometry: GeometryEntity[];
  /** Warnings collected during parse/resolve (non-fatal). */
  warnings: string[];
}
