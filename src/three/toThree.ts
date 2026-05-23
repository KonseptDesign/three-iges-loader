import {
  BufferGeometry,
  EllipseCurve,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
  Object3D,
  Points,
  PointsMaterial,
  Vector2,
  Vector3,
} from "three";
import type { ResolvedIGESModel, GeometryEntity, CircularArcGeometry } from "iges-core";
import { sampleNurbsCurve } from "iges-core";

export interface ToThreeOptions {
  /** Apply IGES Z-up → Three.js Y-up root rotation (default: true). */
  convertZUpToYUp?: boolean;
  /** Samples per circular arc. */
  arcSegments?: number;
  /** Samples per NURBS curve segment. */
  nurbsSegments?: number;
  /** Default line color when DE color is 0. */
  defaultColor?: number;
}

const IGES_COLOR_MAP: Record<number, number> = {
  1: 0x000000,
  2: 0xff0000,
  3: 0x00ff00,
  4: 0x0000ff,
  5: 0xffff00,
  6: 0xff00ff,
  7: 0x00ffff,
  8: 0xffffff,
};

export function toThreeGroup(model: ResolvedIGESModel, options: ToThreeOptions = {}): Group {
  const {
    convertZUpToYUp = true,
    arcSegments = 48,
    nurbsSegments = 64,
    defaultColor = 0x0066cc,
  } = options;

  const root = new Group();
  root.name = model.global.fileName || "IGES";

  if (convertZUpToYUp) {
    root.rotation.x = -Math.PI / 2;
  }

  const scale = model.global.modelSpaceScale || 1;
  if (scale !== 1) {
    root.scale.setScalar(scale);
  }

  for (const entity of model.geometry) {
    const object = geometryEntityToThree(entity, { arcSegments, nurbsSegments, defaultColor });
    if (object) root.add(object);
  }

  return root;
}

function geometryEntityToThree(
  entity: GeometryEntity,
  opts: Required<Pick<ToThreeOptions, "arcSegments" | "nurbsSegments" | "defaultColor">>
): Object3D | null {
  if (entity.kind === "unsupported") return null;

  const color = igesColorToHex(entity.colorNumber, opts.defaultColor);
  const material = new LineBasicMaterial({ color });
  const pointsMaterial = new PointsMaterial({ size: 4, sizeAttenuation: false, color });

  switch (entity.kind) {
    case "point": {
      const geom = new BufferGeometry();
      geom.setAttribute(
        "position",
        new Float32BufferAttribute([entity.position.x, entity.position.y, entity.position.z], 3)
      );
      const mesh = new Points(geom, pointsMaterial);
      mesh.name = `DE${entity.deSequence}_116`;
      return mesh;
    }
    case "line": {
      const geom = new BufferGeometry().setFromPoints([
        new Vector3(entity.start.x, entity.start.y, entity.start.z),
        new Vector3(entity.end.x, entity.end.y, entity.end.z),
      ]);
      const line = new Line(geom, material);
      line.name = `DE${entity.deSequence}_110`;
      line.userData.iges = { deSequence: entity.deSequence, type: 110 };
      return line;
    }
    case "circularArc":
      return circularArcToLine(entity, material, opts.arcSegments);
    case "polyline": {
      const geom = new BufferGeometry().setFromPoints(
        entity.points.map((p) => new Vector3(p.x, p.y, p.z))
      );
      const line = new Line(geom, material);
      line.name = `DE${entity.deSequence}_106`;
      return line;
    }
    case "nurbsCurve": {
      const samples = sampleNurbsCurve(
        entity.degree,
        entity.knots,
        entity.weights,
        entity.controlPoints,
        entity.t0,
        entity.t1,
        opts.nurbsSegments
      );
      const geom = new BufferGeometry().setFromPoints(
        samples.map((p) => new Vector3(p.x, p.y, p.z))
      );
      const line = new Line(geom, material);
      line.name = `DE${entity.deSequence}_126`;
      return line;
    }
    default:
      return null;
  }
}

function circularArcToLine(
  entity: CircularArcGeometry,
  material: LineBasicMaterial,
  segments: number
): Line {
  const startVector = new Vector2(
    entity.start.x - entity.center.x,
    entity.start.y - entity.center.y
  );
  const endVector = new Vector2(entity.end.x - entity.center.x, entity.end.y - entity.center.y);

  const curve = new EllipseCurve(
    entity.center.x,
    entity.center.y,
    entity.radius,
    entity.radius,
    startVector.angle(),
    endVector.angle(),
    false,
    0
  );

  const points2d = curve.getPoints(segments);
  const points3d = points2d.map((p) => new Vector3(p.x, p.y, entity.center.z));

  const geom = new BufferGeometry().setFromPoints(points3d);
  const line = new Line(geom, material);
  line.name = `DE${entity.deSequence}_100`;
  return line;
}

function igesColorToHex(colorNumber: number, fallback: number): number {
  if (colorNumber <= 0) return fallback;
  return IGES_COLOR_MAP[colorNumber] ?? fallback;
}
