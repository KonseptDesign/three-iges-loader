# Entity implementation guide

Use this document when adding or fixing an IGES entity decoder. It is written for **human developers and AI assistants**.

## File checklist

For entity type `NNN`:

1. `packages/iges-core/src/entities/decoders/typeNNN.ts` — decode `RawEntity` → geometry type
2. `packages/iges-core/src/entities/registry.ts` — register decoder, add to `GEOMETRY_ENTITY_TYPES` if drawable
3. `packages/iges-core/src/types.ts` — add `XxxGeometry` interface if new shape
4. `src/three/toThree.ts` — tessellate to Three.js (if drawable)
5. `test/fixtures/<name>.iges` — minimal fixture
6. `packages/iges-core/test/*.test.ts` — assertions on `parseAndResolveIGES`

## Decoder contract

```ts
import type { DecodeContext } from "../decodeContext.js";
import type { SomeGeometry } from "../../types.js";

/** Entity type NNN — <name from IGES spec> */
export function decodeTypeNNN(ctx: DecodeContext): SomeGeometry | null {
  const { entity, transform, warnings } = ctx;
  const p = entity.params; // ParamValue[]
  // Use paramNumber(p, index), paramInt(p, index)
  // Return null + warnings.push(...) if unsupported form
}
```

- **Do not** import `three` in `iges-core`.
- **Do not** apply transforms in decoders; `resolveReferences()` applies world transforms.
- Parameter indices in spec are **1-based**; `paramNumber` uses **0-based** indices (first PD field after entity type = index 0).

## Parameter index mapping

IGES spec tables list parameters starting at index 1 (entity type is separate).

| Spec index | Name | `paramNumber(p, ?)` |
|------------|------|---------------------|
| 1 | First parameter | `0` |
| 2 | Second | `1` |
| n | … | `n - 1` |

## Implemented entities

### Type 116 — Point

| PD index | Field | Type |
|----------|-------|------|
| 1–3 | X, Y, Z | Real |

### Type 110 — Line

| PD index | Field |
|----------|-------|
| 1–3 | Start X,Y,Z |
| 4–6 | End X,Y,Z |

### Type 100 — Circular arc

| PD index | Field |
|----------|-------|
| 1 | ZT |
| 2–3 | Center X,Y |
| 4–5 | Start X,Y |
| 6–7 | End X,Y |

Radius = distance(center, start) in XY.

### Type 106 — Copious data

Use **form number** from DE and **IP** (first PD integer):

| Form / IP | Meaning |
|-----------|---------|
| 12 / IP=2 | (x,y,z) triples |
| 40 | Witness line, common Z |
| 63 | Closed planar polyline |

### Type 126 — Rational B-spline curve

See `decodeType126.ts` for knot/weight/control point layout (K, M, flags, knots, weights, CPs, t0, t1).

Evaluation: `math/nurbs.ts` → `sampleNurbsCurve()`.

## Meta entities (no mesh)

| Type | Role |
|------|------|
| 124 | Transform — parsed in `resolve/parseTransform124.ts` |
| 314 | Color palette |
| 402 | Associativity (visibility, groups) |
| 406 | Property |

## Spec references

- [Eclipse IGES wiki](https://wiki.eclipse.org/IGES_file_Specification)
- [IGES 5.3 PDF](https://web.archive.org/web/20120821190122/http://www.uspro.org/documents/IGES5-3_forDownload.pdf)
- [Wikipedia IGES](https://en.wikipedia.org/wiki/IGES)
