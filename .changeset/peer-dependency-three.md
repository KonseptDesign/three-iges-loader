---
"three-iges-loader": minor
---

Move `three` from runtime dependencies to peer dependencies so consumers use a single Three.js instance. Development and tests now use Three.js r184.

**How to update:** Ensure `three` is installed in your app (`npm install three` / `pnpm add three`). If you previously relied on this package to pull in `three` transitively, add `three` explicitly to your project dependencies.
