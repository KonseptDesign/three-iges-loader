import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseAndResolveIGES, parseIGES } from "../src/index.js";
import { splitSections } from "../src/parse/sections.js";
import { parseGlobalSection } from "../src/parse/parseGlobal.js";
import { splitParameterRecords } from "../src/parse/paramTokenizer.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtures = (name: string) =>
  readFileSync(join(__dirname, "../../../test/fixtures", name), "utf8");

describe("parseIGES", () => {
  it("parses point fixture global section", () => {
    const point = readFileSync(join(__dirname, "../../../test/models/point.iges"), "utf8");
    const model = parseIGES(point);
    expect(model.entities.size).toBe(1);
    const entity = model.entities.get(1);
    expect(entity?.type).toBe(116);
  });

  it("parses line fixture", () => {
    const line = readFileSync(join(__dirname, "../../../test/models/line.iges"), "utf8");
    const model = parseAndResolveIGES(line);
    expect(model.geometry).toHaveLength(1);
    expect(model.geometry[0]?.kind).toBe("line");
    const lineGeom = model.geometry[0];
    if (lineGeom?.kind === "line") {
      expect(lineGeom.start.x).toBeCloseTo(-30.133802, 4);
      expect(lineGeom.end.x).toBeCloseTo(31.404655, 4);
    }
  });

  it("parses point into PointGeometry", () => {
    const point = readFileSync(join(__dirname, "../../../test/models/point.iges"), "utf8");
    const model = parseAndResolveIGES(point);
    expect(model.geometry).toHaveLength(1);
    const g = model.geometry[0];
    expect(g?.kind).toBe("point");
    if (g?.kind === "point") {
      expect(g.position.x).toBe(10);
      expect(g.position.y).toBe(20);
      expect(g.position.z).toBe(30);
    }
  });

  it("parses slot fixture parameter records", () => {
    const sections = splitSections(fixtures("slot.iges"));
    const global = parseGlobalSection(sections.global);
    const records = splitParameterRecords(sections.parameter, global.recordDelimiter);
    expect(records.length).toBe(6);
  });

  it("parses slot fixture with 6 geometry entities", () => {
    const model = parseAndResolveIGES(fixtures("slot.iges"), { validateLineCounts: false });
    const kinds = model.geometry.map((g) => g.kind);
    expect(kinds.filter((k) => k === "point")).toHaveLength(2);
    expect(kinds.filter((k) => k === "circularArc")).toHaveLength(2);
    expect(kinds.filter((k) => k === "line")).toHaveLength(2);
  });

  it("parses arc fixture with correct radius", () => {
    const model = parseAndResolveIGES(fixtures("arc.iges"));
    const arc = model.geometry.find((g) => g.kind === "circularArc");
    expect(arc?.kind).toBe("circularArc");
    if (arc?.kind === "circularArc") {
      expect(arc.radius).toBeCloseTo(1, 5);
      expect(arc.center.x).toBeCloseTo(0, 5);
      expect(arc.center.y).toBeCloseTo(0, 5);
    }
  });
});

describe("hollerith and delimiters", () => {
  it("reads custom field delimiter from global section", () => {
    const model = parseIGES(fixtures("slot.iges"));
    expect(model.global.productIdFromSender).toContain("SLOT");
    expect(model.global.fileName).toContain("slot.iges");
  });
});
