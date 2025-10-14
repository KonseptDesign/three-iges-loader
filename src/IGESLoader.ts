import {
  BufferGeometry,
  EllipseCurve,
  FileLoader,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
  Loader,
  LoadingManager,
  Points,
  PointsMaterial,
  Vector2,
  Vector3,
} from "three";

/**
 * Entity attribute interface for IGES entities
 */
interface EntityAttribute {
  entityType: number;
  entityIndex?: number;
  igesVersion?: number;
  lineType?: number;
  level?: number;
  view?: number;
  transMatrix?: number;
  labelDisp?: number;
  status?: string;
  sequenceNumber?: number;
  lineWidth?: number;
  color?: number;
  paramLine?: number;
  formNumber?: number;
  entityName?: string;
  entitySub?: number;
}

/**
 * Entity parameter type - can be string or number
 */
type EntityParam = string | number;

/**
 * IGES Entity class
 */
class Entity {
  type: string;
  attr: EntityAttribute;
  params: EntityParam[];

  constructor(attribute: EntityAttribute = { entityType: 0 }, params: EntityParam[] = []) {
    this.type = attribute.entityType.toString();
    this.attr = attribute;
    this.params = params;
  }
}

/**
 * IGES file structure interface
 */
interface IGESData {
  fieldDelimiter: string;
  termDelimiter: string;
  entities: Entity[];
  comment?: string;
  exportID?: string;
  fileName?: string;
  systemID?: string;
  translateVer?: string;
  integerBits?: string;
  singleExpBits?: string;
  singleMantissaBits?: string;
  doubleExpBits?: string;
  doubleMantissaBits?: string;
  receiveID?: string;
  scale?: string;
  unitFlag?: string;
  unit?: string;
  maxStep?: string;
  maxWidth?: string;
  createDate?: string;
  resolution?: string;
  maxValue?: string;
  createUser?: string;
  createOrg?: string;
  igesVer?: string;
  formatCode?: string;
  lastModifiedDate?: string;
  lineNum_S?: number;
  lineNum_G?: number;
  lineNum_D?: number;
  lineNum_P?: number;
}

/**
 * Description: A THREE loader for IGES files, as created by Solidworks and other CAD programs.
 *
 * @see https://wiki.eclipse.org/IGES_file_Specification
 * @see https://web.archive.org/web/20120821190122/http://www.uspro.org/documents/IGES5-3_forDownload.pdf
 * @see https://filemonger.com/specs/igs/devdept.com/version6.pdf - IGES Version 6.0
 * @see https://en.wikipedia.org/wiki/IGES - More info on IGES
 *
 * @example
 * ```typescript
 * const loader = new IGESLoader();
 * loader.load('/path/to/file.igs', (geometry) => {
 *   scene.add(geometry);
 * });
 * ```
 */
class IGESLoader extends Loader<Group> {
  constructor(manager?: LoadingManager) {
    super(manager);
  }

  /**
   * Load an IGES file from a URL
   * @param url - The URL or path to the IGES file
   * @param onLoad - Callback when loading is complete
   * @param onProgress - Callback for loading progress
   * @param onError - Callback when an error occurs
   */
  override load(
    url: string,
    onLoad: (geometry: Group) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: unknown) => void
  ): void {
    const loader = new FileLoader(this.manager);
    loader.setPath(this.path);
    loader.setResponseType("text");

    loader.load(
      url,
      (text: unknown) => {
        try {
          onLoad(this.parse(text as string));
        } catch (e) {
          if (onError) {
            onError(e instanceof Error ? e : new Error(String(e)));
          } else {
            console.error(e);
          }
          this.manager.itemError(url);
        }
      },
      onProgress,
      onError
    );
  }

  /**
   * Parse IGES file content
   * @param data - The IGES file content as string
   * @returns A Three.js Group containing the parsed geometry
   */
  parse(data: string): Group {
    class IGES implements IGESData {
      fieldDelimiter = ","; // as default
      termDelimiter = ";"; // as default
      entities: Entity[] = [];
      comment?: string;
      exportID?: string;
      fileName?: string;
      systemID?: string;
      translateVer?: string;
      integerBits?: string;
      singleExpBits?: string;
      singleMantissaBits?: string;
      doubleExpBits?: string;
      doubleMantissaBits?: string;
      receiveID?: string;
      scale?: string;
      unitFlag?: string;
      unit?: string;
      maxStep?: string;
      maxWidth?: string;
      createDate?: string;
      resolution?: string;
      maxValue?: string;
      createUser?: string;
      createOrg?: string;
      igesVer?: string;
      formatCode?: string;
      lastModifiedDate?: string;
      lineNum_S?: number;
      lineNum_G?: number;
      lineNum_D?: number;
      lineNum_P?: number;

      parseStart(data: string): void {
        this.comment = data;
      }

      parseGlobal(data: string): void {
        if (data[0] !== ",") {
          this.fieldDelimiter = parseIgesString(data) || ",";
        }
        const fields = data.split(this.fieldDelimiter);
        if (data[0] !== ",") {
          fields.splice(0, 1);
        }

        this.termDelimiter = parseIgesString(fields[1] ?? "") || ";";
        this.exportID = parseIgesString(fields[2] ?? "");
        this.fileName = parseIgesString(fields[3] ?? "");
        this.systemID = parseIgesString(fields[4] ?? "");
        this.translateVer = parseIgesString(fields[5] ?? "");
        this.integerBits = fields[6];
        this.singleExpBits = fields[7];
        this.singleMantissaBits = fields[8];
        this.doubleExpBits = fields[9];
        this.doubleMantissaBits = fields[10];
        this.receiveID = parseIgesString(fields[11] ?? "");
        this.scale = fields[12];
        this.unitFlag = fields[13];
        this.unit = parseIgesString(fields[14] ?? "");
        this.maxStep = fields[15];
        this.maxWidth = fields[16];
        this.createDate = parseIgesString(fields[17] ?? "");
        this.resolution = fields[18];
        this.maxValue = fields[19];
        this.createUser = parseIgesString(fields[20] ?? "");
        this.createOrg = parseIgesString(fields[21] ?? "");
        this.igesVer = fields[22];
        this.formatCode = fields[23];
        this.lastModifiedDate = parseIgesString(fields[24] ?? "");
      }

      parseDirection(data: string): void {
        for (let i = 0; i < data.length; i += 160) {
          const entity = new Entity();
          const attr = entity.attr;
          const item = data.substr(i, 160);
          attr.entityType = parseInt(item.substr(0, 8));
          attr.entityIndex = parseInt(item.substr(8, 8));
          attr.igesVersion = parseInt(item.substr(16, 8));
          attr.lineType = parseInt(item.substr(24, 8));
          attr.level = parseInt(item.substr(32, 8));
          attr.view = parseInt(item.substr(40, 8));
          attr.transMatrix = parseInt(item.substr(48, 8));
          attr.labelDisp = parseInt(item.substr(56, 8));
          attr.status = item.substr(64, 8);
          attr.sequenceNumber = parseInt(item.substr(73, 7));

          attr.lineWidth = parseInt(item.substr(88, 8));
          attr.color = parseInt(item.substr(96, 8));
          attr.paramLine = parseInt(item.substr(104, 8));
          attr.formNumber = parseInt(item.substr(112, 8));

          attr.entityName = item.substr(136, 8).trim();
          attr.entitySub = parseInt(item.substr(144, 8));

          this.entities.push(entity);
        }
      }

      parseParameter(data: string): void {
        const params = data.split(";");
        params.pop();
        const splitParams = params.map((item) => item.split(","));

        for (let i = 0; i < splitParams.length; i++) {
          const entity = this.entities[i];
          if (entity) {
            const paramArray = splitParams[i];
            if (paramArray) {
              entity.type = paramArray.shift() || "";
              entity.params = paramArray.map(parseIgesFloat);
            }
          }
        }
      }

      parseTerminate(data: string): void {
        this.lineNum_S = parseInt(data.substr(1, 7));
        this.lineNum_G = parseInt(data.substr(9, 7));
        this.lineNum_D = parseInt(data.substr(17, 7));
        this.lineNum_P = parseInt(data.substr(25, 7));

        if (this.lineNum_D && this.entities.length !== this.lineNum_D / 2) {
          throw new Error("ERROR: Inconsistent entity count");
        }
      }
    }

    function parseIges(data: string): Group {
      const geometry = new Group();
      geometry.name = "Group_" + Math.floor(Math.random() * 10000000);

      const iges = new IGES();

      // Split by newline and filter out completely empty lines
      // Don't trim before filtering as IGES lines can be space-padded
      const lines = data.split(/\r?\n/).filter((item) => item.length > 0);

      let currentSection = "";
      let startSec = "",
        globalSec = "",
        dirSec = "",
        paramSec = "",
        terminateSec = "";

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i] ?? "";

        // Skip lines that are too short (less than 73 characters for valid IGES)
        if (line.length < 73) {
          console.warn(
            `Skipping invalid IGES line ${i}: line too short (${line.length} chars): "${line.substring(0, 50)}"`
          );
          continue;
        }

        currentSection = line[72] ?? "";
        line = line.substr(0, 80);

        switch (currentSection) {
          case "S": {
            startSec += line.substr(0, 72).trim();
            break;
          }
          case "G": {
            globalSec += line.substr(0, 72).trim();
            break;
          }
          case "D": {
            dirSec += line;
            break;
          }
          case "P": {
            paramSec += line.substr(0, 64).trim();
            break;
          }
          case "T": {
            terminateSec += line.substr(0, 72).trim();
            break;
          }
          default:
            console.warn(
              `Skipping line ${i} with unknown section type: '${currentSection}' (char code: ${currentSection.charCodeAt(0)})`
            );
            // Don't throw error, just skip unknown section types
            break;
        }
      }

      iges.parseStart(startSec);
      iges.parseGlobal(globalSec);
      iges.parseDirection(dirSec);
      iges.parseParameter(paramSec);
      iges.parseTerminate(terminateSec);

      const entities = iges.entities;

      /**
       * CIRCULAR ARC ENTITY (TYPE 100)
       *
       * Parameter Data
       *
       * Index  Name  Type  Description
       * 1      ZT    Real  Parallel ZT displacement of arc from XT ; YT plane
       * 2      X1    Real  Arc center abscissa
       * 3      Y1    Real  Arc center ordinate
       * 4      X2    Real  Start point abscissa
       * 5      Y2    Real  Start point ordinate
       * 6      X3    Real  Terminate point abscissa
       * 7      Y3    Real  Terminate point ordinate
       */
      function drawCArc(entity: Entity): void {
        const entityParams = entity.params;

        const startVector = new Vector2(
          Number(entityParams[3]) - Number(entityParams[1]),
          Number(entityParams[4]) - Number(entityParams[2])
        );
        const endVector = new Vector2(
          Number(entityParams[5]) - Number(entityParams[1]),
          Number(entityParams[6]) - Number(entityParams[2])
        );

        const startAngle = startVector.angle();
        const endAngle = endVector.angle();

        const curve = new EllipseCurve(
          Number(entityParams[1]),
          Number(entityParams[2]), // ax, aY
          1,
          1, // xRadius, yRadius
          startAngle,
          endAngle, // aStartAngle, aEndAngle
          false, // aClockwise
          0 // aRotation
        );

        const points = curve.getPoints(50);

        const geom = new BufferGeometry();
        geom.setFromPoints(points);

        const material = new LineBasicMaterial({ color: 0x0000ff });
        const mesh = new Line(geom, material);

        mesh.position.set(0, 0, 0);
        mesh.rotation.set(-Math.PI / 2, 0, 0);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        geometry.add(mesh);
      }

      /**
       * COMPOSITE CURVE ENTITY (TYPE 102)
       *
       * Parameter Data
       *
       * Index  Name   Type     Description
       * 1      N      Integer  Number of entities
       * 2      DE(1)  Pointer  Pointer to the DE of the first constituent entity
       * ...
       * 1+N    DE(N)  Pointer  Pointer to the DE of the last constituent entity
       */
      function drawCCurve(_entity: Entity): void {
        // TODO: Implement composite curve
      }

      /**
       * COPIOUS DATA ENTITY (TYPE 106, FORMS 1-3)
       * LINEAR PATH ENTITY (TYPE 106, FORMS 11-13)
       * CENTERLINE ENTITY (TYPE 106, FORMS 20-21)
       * SECTION ENTITY (TYPE 106, FORMS 31–38)
       * WITNESS LINE ENTITY (TYPE 106, FORM 40)
       * SIMPLE CLOSED PLANAR CURVE ENTITY (TYPE 106, FORM 63)
       */
      function drawPath(entity: Entity): void {
        const entityAttr = entity.attr;
        const entityParams = entity.params;

        const geom = new BufferGeometry();
        const points: Vector3[] = [];

        switch (entityAttr.formNumber?.toString()) {
          /**
           * LINEAR PATH ENTITY (TYPE 106, FORMS 11-13)
           *
           * For IP=2 (x,y,z triples), i.e., for Form 12:
           * Index  Name   Type     Description
           * 1      IP     Integer  Interpretation Flag (1/2/3)
           * 2      N      Integer  Number of n-tuples; N >= 2
           * 3      X(1)   Real     First data point x value
           * 4      Y(1)   Real     First data point y value
           * 5      Z(1)   Real     First data point z value
           * ...
           * 2+3*N  Z(N)   Real     Last data point z value
           */
          case "12":
            for (let i = 0; i < Number(entityParams[1]); i++) {
              points.push(
                new Vector3(
                  Number(entityParams[2 + 3 * i]),
                  Number(entityParams[3 + 3 * i]),
                  Number(entityParams[4 + 3 * i])
                )
              );
            }
            break;
          /**
           * WITNESS LINE ENTITY (TYPE 106, FORM 40)
           *
           * Index  Name   Type     Description
           * 1      IP     Integer  Interpretation Flag: IP = 1
           * 2      N      Integer  Number of data points: N ≥ 3 and odd
           * 3      ZT     Real     Common z displacement
           * 4      X(1)   Real     First data point abscissa
           * 5      Y(1)   Real     First data point ordinate
           * ...
           */
          case "40":
            for (let i = 0; i < Number(entityParams[1]); i++) {
              points.push(
                new Vector3(
                  Number(entityParams[3 + 2 * i]),
                  Number(entityParams[4 + 2 * i]),
                  Number(entityParams[2])
                )
              );
            }
            break;

          case "63":
            for (let i = 0; i < Number(entityParams[1]); i++) {
              points.push(
                new Vector3(Number(entityParams[3 + 2 * i]), Number(entityParams[4 + 2 * i]), 0)
              );
            }
            break;

          default:
            console.log("Unsupported Form Number: ", entityAttr.formNumber);
        }

        geom.setFromPoints(points);

        const material = new LineBasicMaterial({ color: 0x0000ff });
        const mesh = new Line(geom, material);

        mesh.position.set(0, 0, 0);
        mesh.rotation.set(-Math.PI / 2, 0, 0);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        geometry.add(mesh);
      }

      /**
       * PLANE ENTITY (TYPE 108)
       *
       * Unbounded Plane Entity (Type 108, Form 0)
       */
      function drawPlane(_entity: Entity): void {
        // TODO: Implement plane entity
      }

      /**
       * LINE ENTITY (TYPE 110, FORM 0)
       * LINE ENTITY (TYPE 110, FORMS 1-2)
       */
      function drawLine(entity: Entity): void {
        const entityAttr = entity.attr;
        const entityParams = entity.params;

        const geom = new BufferGeometry();
        const points: Vector3[] = [];

        switch (entityAttr.formNumber?.toString()) {
          /**
           * LINE ENTITY (TYPE 110, FORMS 0)
           *
           * Index  Name  Type  Description
           * 1      X1    Real  Start Point P1
           * 2      Y1    Real
           * 3      Z1    Real
           * 4      X2    Real  Terminate Point P2
           * 5      Y2    Real
           * 6      Z2    Real
           */
          case "0":
          case "2":
            points.push(
              new Vector3(Number(entityParams[0]), Number(entityParams[1]), Number(entityParams[2]))
            );
            points.push(
              new Vector3(Number(entityParams[3]), Number(entityParams[4]), Number(entityParams[5]))
            );
            break;

          default:
            if (isNaN(Number(entityAttr.formNumber))) {
              points.push(
                new Vector3(
                  Number(entityParams[0]),
                  Number(entityParams[1]),
                  Number(entityParams[2])
                )
              );
              points.push(
                new Vector3(
                  Number(entityParams[3]),
                  Number(entityParams[4]),
                  Number(entityParams[5])
                )
              );
            } else {
              console.log(
                "LINE ENTITY - TYPE 110 - Unsupported Form Number: ",
                entityAttr.formNumber
              );
            }
        }

        geom.setFromPoints(points);

        const material = new LineBasicMaterial({ color: 0x0000ff });
        const mesh = new Line(geom, material);

        mesh.position.set(0, 0, 0);
        mesh.rotation.set(-Math.PI / 2, 0, 0);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        geometry.add(mesh);
      }

      /**
       * POINT ENTITY (TYPE 116)
       */
      function drawPoint(entity: Entity): void {
        const entityParams = entity.params;

        const geom = new BufferGeometry();

        const points: number[] = [];
        points.push(Number(entityParams[0]), Number(entityParams[1]), Number(entityParams[2]));

        geom.setAttribute("position", new Float32BufferAttribute(points, 3));

        const material = new PointsMaterial({
          size: 5,
          sizeAttenuation: false,
        });
        const mesh = new Points(geom, material);

        mesh.position.set(0, 0, 0);
        mesh.rotation.set(-Math.PI / 2, 0, 0);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        geometry.add(mesh);
      }

      /**
       * SURFACE OF REVOLUTION ENTITY (TYPE 120)
       */
      function drawRSurface(_entity: Entity): void {
        // TODO: Implement surface of revolution
      }

      /**
       * TABULATED CYLINDER ENTITY (TYPE 122)
       */
      function drawTCylinder(_entity: Entity): void {
        // TODO: Implement tabulated cylinder
      }

      /**
       * TRANSFORMATION MATRIX ENTITY (TYPE 124)
       *
       * Parameter Data
       *
       * Index  Name  Type  Description
       * 1      R11   Real  Top Row
       * 2      R12   Real
       * 3      R13   Real
       * 4      T1    Real
       * 5      R21   Real  Second Row
       * 6      R22   Real
       * 7      R23   Real
       * 8      T2    Real
       * 9      R31   Real  Third Row
       * 10     R32   Real
       * 11     R33   Real
       * 12     T3    Real
       */
      function drawTransMatrix(entity: Entity): void {
        const entityAttr = entity.attr;

        switch (entityAttr.formNumber?.toString()) {
          /**
           * Form 0: (default) R is an orthonormal matrix with determinant equal to positive one.
           * T is arbitrary. The columns of R, taken in order, form a right-handed triple
           * in the output coordinate system.
           */
          case "0":
            // TODO: Implement transformation matrix
            break;
          default:
            console.log(
              "TRANSFORMATION MATRIX - TYPE 124 - Unsupported Form Number: ",
              entityAttr.formNumber
            );
        }
      }

      /**
       * RATIONAL B-SPLINE CURVE ENTITY (TYPE 126)
       */
      function drawRBSplineCurve(entity: Entity): void {
        const entityAttr = entity.attr;
        const entityParams = entity.params;

        const geom = new BufferGeometry();
        const points: Vector3[] = [];

        const K = Number(entityParams[0]);
        const M = Number(entityParams[1]);
        const N = 1 + K - M;
        const A = N + 2 * M;

        switch (entityAttr.formNumber?.toString()) {
          /**
           * Form  Meaning
           * 0     Form of curve is determined from the rational B-spline parameters
           * 1     Line
           * 2     Circular arc
           * 3     Elliptical arc
           * 4     Parabolic arc
           * 5     Hyperbolic arc
           */
          case "0":
          case "1":
            for (let i = 0; i < K + 1; i++) {
              points.push(
                new Vector3(
                  Number(entityParams[i * 3 + 8 + A + K]),
                  Number(entityParams[i * 3 + 9 + A + K]),
                  Number(entityParams[i * 3 + 10 + A + K])
                )
              );
            }
            break;
          default:
          // TODO: Implement other B-spline forms
        }

        geom.setFromPoints(points);

        const material = new LineBasicMaterial({ color: 0x0000ff });
        const mesh = new Line(geom, material);

        mesh.position.set(0, 0, 0);
        mesh.rotation.set(-Math.PI / 2, 0, 0);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        geometry.add(mesh);
      }

      /**
       * RATIONAL B-SPLINE SURFACE ENTITY (TYPE 128)
       */
      function drawRBSplineSurface(_entity: Entity): void {
        // TODO: Implement B-spline surface
      }

      /**
       * CURVE ON A PARAMETRIC SURFACE ENTITY (TYPE 142)
       */
      function drawCurveOnPSurface(_entity: Entity): void {
        // TODO: Implement curve on parametric surface
      }

      /**
       * TRIMMED (PARAMETRIC) SURFACE ENTITY (TYPE 144)
       */
      function drawTPSurface(_entity: Entity): void {
        // TODO: Implement trimmed parametric surface
      }

      /**
       * GENERAL NOTE ENTITY (TYPE 212)
       */
      function drawGeneralNote(_entity: Entity): void {
        // TODO: Implement general note
      }

      /**
       * LEADER (ARROW) ENTITY (TYPE 214)
       */
      function drawLeaderArrow(_entity: Entity): void {
        // TODO: Implement leader arrow
      }

      /**
       * LINEAR DIMENSION ENTITY (TYPE 216)
       */
      function drawLinearDimension(_entity: Entity): void {
        // TODO: Implement linear dimension
      }

      /**
       * COLOR DEFINITION ENTITY (TYPE 314)
       */
      function drawColor(_entity: Entity): void {
        // TODO: Implement color definition
      }

      /**
       * ASSOCIATIVITY INSTANCE ENTITY (TYPE 402)
       */
      function drawAInstance(_entity: Entity): void {
        // TODO: Implement associativity instance
      }

      /**
       * PROPERTY ENTITY (TYPE 406)
       */
      function propertyEntity(_entity: Entity): void {
        // TODO: Implement property entity
      }

      // Process all entities
      for (const entity of entities) {
        switch (entity.type) {
          case "100":
            drawCArc(entity);
            break;
          case "102":
            drawCCurve(entity);
            break;
          case "106":
            drawPath(entity);
            break;
          case "108":
            drawPlane(entity);
            break;
          case "110":
            drawLine(entity);
            break;
          case "116":
            drawPoint(entity);
            break;
          case "120":
            drawRSurface(entity);
            break;
          case "122":
            drawTCylinder(entity);
            break;
          case "124":
            drawTransMatrix(entity);
            break;
          case "126":
            drawRBSplineCurve(entity);
            break;
          case "128":
            drawRBSplineSurface(entity);
            break;
          case "142":
            drawCurveOnPSurface(entity);
            break;
          case "144":
            drawTPSurface(entity);
            break;
          case "212":
            drawGeneralNote(entity);
            break;
          case "214":
            drawLeaderArrow(entity);
            break;
          case "216":
            drawLinearDimension(entity);
            break;
          case "314":
            drawColor(entity);
            break;
          case "402":
            drawAInstance(entity);
            break;
          case "406":
            propertyEntity(entity);
            break;
          default:
            console.log("Uncompliment entity type", entity.type);
        }
      }

      return geometry;
    }

    function parseIgesFloat(p: string): number {
      return parseFloat(p.replace(/D/g, "e"));
    }

    function parseIgesString(str: string): string | undefined {
      try {
        const d = str.indexOf("H");
        if (d === -1) return undefined;
        const digit = str.substr(0, d);
        const value = str.substr(d + 1, parseInt(digit));
        return value;
      } catch (e) {
        console.error(e);
        return undefined;
      }
    }

    return parseIges(data);
  }
}

export { IGESLoader };
export type { EntityAttribute, EntityParam, IGESData };
