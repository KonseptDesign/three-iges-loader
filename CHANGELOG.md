# three-iges-loader

## 2.0.0

### Major Changes

- 6edeab7: ## Major TypeScript Migration and Modernization

  This is a comprehensive migration to a modern TypeScript-native package with significant improvements and breaking changes.

  ### ✨ New Features
  - **Full TypeScript Support**: Complete rewrite from JavaScript to TypeScript with strict type checking
  - **Dual Module Format**: Native ESM and CommonJS support with proper exports field
  - **Modern Build System**: Migrated from Babel to tsup for faster, optimized builds
  - **Enhanced Testing**: Migrated from Jest to Vitest with native TypeScript support
  - **Code Quality Tools**: Added ESLint 9, Prettier, Husky, and lint-staged
  - **CI/CD**: New GitHub Actions workflow for automated testing and publishing
  - **Modern Example**: Vite-based TypeScript example with hot module replacement

  ### 📦 Dependency Updates
  - Three.js updated from 0.158.0 to 0.180.0
  - Node.js requirement: >=18.0.0

  ### 💥 Breaking Changes

  **WHAT**: Package is now ESM-first with dual module support

  **WHY**: Modern JavaScript ecosystem has moved to ESM, providing better tree-shaking and performance

  **HOW TO UPDATE**:
  1. **For ESM projects** (recommended):

     ```typescript
     import { IGESLoader } from "three-iges-loader";
     ```

  2. **For CommonJS projects**:

     ```javascript
     const { IGESLoader } = require("three-iges-loader");
     ```

  3. **TypeScript users** now get full type definitions out of the box - no need for separate `@types` packages
  4. **Module resolution**: If you encounter issues, ensure your `tsconfig.json` has:
     ```json
     {
       "compilerOptions": {
         "moduleResolution": "bundler" // or "node16"
       }
     }
     ```

  ### 🐛 Bug Fixes
  - Fixed IGES file parsing for cross-platform line endings (Windows/Unix)
  - Improved file loading in browser environments

  ### 📚 Documentation
  - Comprehensive MIGRATION.md guide added
  - Updated README with modern examples
  - Added inline JSDoc comments for better IDE support

## 1.2.2

### Patch Changes

- 9082105: README update

## 1.2.1

### Patch Changes

- 76f2f57: update to pnpm and add github workflows for npm publish
