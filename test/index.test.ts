import fs from "node:fs";
import { describe, it, expect } from "vitest";
import { IGESLoader } from "../src/IGESLoader.js";
import * as THREE from "three";

describe("IGESLoader", () => {
  it("loader should be type of IGESLoader", () => {
    const loader = new IGESLoader();
    expect(loader).toBeInstanceOf(IGESLoader);
  });

  it("should parse a point", () => {
    const loader = new IGESLoader();
    expect(loader).toBeInstanceOf(IGESLoader);

    const filePath = "test/models/point.iges";
    const data = fs.readFileSync(filePath, "utf8");

    const test = loader.parse(data);
    const points = test.children[0] as THREE.Points;
    expect(points).toBeInstanceOf(THREE.Points);

    const pointBufferGeometry = points.geometry;
    expect(pointBufferGeometry).toBeInstanceOf(THREE.BufferGeometry);

    if (pointBufferGeometry && pointBufferGeometry.attributes.position) {
      const pointVertice_x = pointBufferGeometry.attributes.position.array[0];
      const pointVertice_y = pointBufferGeometry.attributes.position.array[1];
      const pointVertice_z = pointBufferGeometry.attributes.position.array[2];
      expect(pointVertice_x).toBe(10);
      expect(pointVertice_y).toBe(20);
      expect(pointVertice_z).toBe(30);
    }
  });

  it("should parse a line", () => {
    const loader = new IGESLoader();
    expect(loader).toBeInstanceOf(IGESLoader);

    const filePath = "test/models/line.iges";
    const data = fs.readFileSync(filePath, "utf8");

    const test = loader.parse(data);
    const line = test.children[0] as THREE.Line;
    expect(line).toBeInstanceOf(THREE.Line);

    const lineBufferGeometry = line.geometry;
    expect(lineBufferGeometry).toBeInstanceOf(THREE.BufferGeometry);

    if (lineBufferGeometry && lineBufferGeometry.attributes.position) {
      const p1_x = lineBufferGeometry.attributes.position.array[0];
      const p1_y = lineBufferGeometry.attributes.position.array[1];
      const p1_z = lineBufferGeometry.attributes.position.array[2];
      expect(p1_x).toBe(-30.13380241394043);
      expect(p1_y).toBe(13.59160041809082);
      expect(p1_z).toBe(0);

      const p2_x = lineBufferGeometry.attributes.position.array[3];
      const p2_y = lineBufferGeometry.attributes.position.array[4];
      const p2_z = lineBufferGeometry.attributes.position.array[5];
      expect(p2_x).toBe(31.40465545654297);
      expect(p2_y).toBe(42.65143585205078);
      expect(p2_z).toBe(0);
    }
  });
});
