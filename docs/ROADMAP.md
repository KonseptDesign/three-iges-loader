# IGES implementation roadmap

Status key: ✅ done · 🚧 in progress · ⬜ planned

Target spec: **IGES 5.3** ([PDF](https://web.archive.org/web/20120821190122/http://www.uspro.org/documents/IGES5-3_forDownload.pdf)). IGES 6.0 extensions are tracked separately.

Test corpus: `test/fixtures/` (including Wikipedia **slot**), `test/models/`, and future [IGES X-files](https://web.archive.org/web/20100301144417/http://www.wiz-worx.com/iges5x/wysiwyg/f214x.shtml).

---

## Phase A — Foundation ✅ (current)

| Item | Status |
|------|--------|
| `iges-core` package, section parser, Hollerith, param tokenizer | ✅ |
| DE / PD mapping, `IGESModel`, warnings | ✅ |
| Type 124 transform resolution | ✅ |
| Unit tests + slot / arc fixtures | ✅ |
| Monorepo, docs, AGENTS.md | ✅ |

---

## Phase B — Wireframe & curves (current focus)

| Type | Name | Decode | Three.js | Tests |
|------|------|--------|----------|-------|
| 116 | Point | ✅ | ✅ | ✅ |
| 110 | Line | ✅ | ✅ | ✅ |
| 100 | Circular arc | ✅ | ✅ | ✅ arc.iges |
| 106 | Copious data / paths | ✅ partial | ✅ | ✅ slot |
| 126 | NURBS curve | ✅ evaluate | ✅ sample | ⬜ dedicated fixture |
| 102 | Composite curve | ⬜ | ⬜ | ⬜ |
| 104 | Conic arc | ⬜ | ⬜ | ⬜ |
| 112 | Parametric spline curve | ⬜ | ⬜ | ⬜ |
| 123 | Direction | ⬜ meta | — | ⬜ |
| 124 | Transform | ✅ resolve | — | ⬜ |
| 402 | Associativity | ⬜ | ⬜ | ⬜ |
| 314 | Color definition | ⬜ | ⬜ | ⬜ |
| 408 | Subfigure instance | ⬜ | ⬜ | ⬜ |

**Phase B exit criteria:** slot + fmeparte wireframe renders correctly; composite curves follow DE pointers; colors from DE/314.

---

## Phase C — Surfaces (deferred)

| Type | Name | Notes |
|------|------|-------|
| 114 | Parametric spline surface | Polynomial patches |
| 118 | Ruled surface | Sweep between curves |
| 120 | Surface of revolution | |
| 122 | Tabulated cylinder | |
| 128 | Rational B-spline surface | Critical for most CAD |
| 141–144 | Boundary / trimmed surface | Needs UV trimming |
| 190–198 | Analytic surfaces | Plane, cylinder, sphere, torus |

Tessellation: adaptive UV grid → `BufferGeometry` meshes.

---

## Phase D — Solids & B-rep (deferred)

| Type | Name | Notes |
|------|------|-------|
| 186 | Manifold solid B-rep | Shell pointer |
| 502–514 | Vertex/edge/loop/face/shell | Topology |
| 150–168 | Primitive solids | Block, cone, sphere… |
| 180 | Boolean tree | CSG |

Consider **opencascade.js** adapter package for production-grade solids.

---

## Phase E — Product polish

- Worker-based `parseAsync`
- `userData.iges` on all objects (partial today)
- R3F examples in docs
- Published `@konsept/iges-core` npm package (optional separate publish)
