# Restructure plan (executed)

This document records the architectural restructure agreed in review. For living status, see [ROADMAP.md](./ROADMAP.md).

## Objectives

1. Split **parsing** (`iges-core`) from **rendering** (Three.js).
2. Establish tests and fixtures before expanding entity coverage.
3. Document structure for human and AI contributors.
4. Defer surfaces/B-rep to later phases.

## Completed in this restructure

- [x] pnpm workspace with `packages/iges-core`
- [x] Section parser (S/G/D/P/T), global, directory, parameter tokenization
- [x] Entity decoders: 100, 106, 110, 116, 126
- [x] Transform resolution (124)
- [x] `toThreeGroup` + thin `IGESLoader`
- [x] Fixtures: `slot.iges`, `arc.iges`; existing `point` / `line`
- [x] Unit + integration tests
- [x] `AGENTS.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `ENTITY_IMPLEMENTATION.md`

## Next implementation steps (Phase B)

1. **Type 102** composite curve — resolve DE pointers, emit polyline or child curves.
2. **Type 104** conic arc — tessellate to polyline.
3. **Dedicated 126 fixture** — validate NURBS evaluation against known points.
4. **Type 314 / DE color** — wire `igesColorToHex` to resolved color entities.
5. **fmeparte.igs** — add fixture when a stable copy is available (X-file).

## React Three Fiber

```tsx
import { useLoader } from '@react-three/fiber';
import { IGESLoader } from 'three-iges-loader';

function Model({ url }: { url: string }) {
  const scene = useLoader(IGESLoader, url);
  return <primitive object={scene} />;
}
```

Advanced: `parseAndResolveIGES` + custom `toThreeGroup` options without the loader class.
