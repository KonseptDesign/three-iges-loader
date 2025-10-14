<p align="center">
<h1 align="center">three-iges-loader</h1>
</p>
<p align="center">
<a href="https://www.npmjs.com/package/three-iges-loader"><img src="https://img.shields.io/npm/v/three-iges-loader?label=latest" alt="npm version" /></a>
<a href="https://github.com/Konsept-Design/three-iges-loader/blob/main/LICENSE" rel="nofollow"><img src="https://img.shields.io/npm/l/three-iges-loader" alt="license" /></a>
<a href="https://github.com/Konsept-Design/three-iges-loader/actions?query=branch%3Amain" rel="nofollow"><img src="https://github.com/Konsept-Design/three-iges-loader/actions/workflows/main.yml/badge.svg?event=push&branch=main" alt="build status" /></a>
<a href="https://github.com/Konsept-Design/three-iges-loader" rel="nofollow"><img src="https://img.shields.io/github/stars/Konsept-Design/three-iges-loader" alt="stars"></a>
</p>

**IGESLoader** is a modern TypeScript-native IGES file loader for Three.js.

> [!WARNING]
> This package is currently in active development and may not be stable. Use with caution.

> [!NOTE]
> Currently, only a limited number of 'entity' types are parsed (mainly to be able to display points/lines/curves).

## Features

✨ **TypeScript Native** - Written in TypeScript with full type definitions  
📦 **Modern ESM/CJS** - Dual package format with tree-shaking support  
🔧 **Fully Typed** - Complete type safety for all IGES entities  
⚡ **Fast** - Optimized build with tsup and modern tooling  
🧪 **Well Tested** - Comprehensive test suite with Vitest

## Install

```bash
pnpm add three-iges-loader three
```

Or using npm:

```bash
npm install three-iges-loader three
```

Or using yarn:

```bash
yarn add three-iges-loader three
```

## Usage

### JavaScript

```js
import * as THREE from "three";
import { IGESLoader } from "three-iges-loader";

const loader = new IGESLoader();

const iges_file_path = "/file.iges";

loader.load(
  // resource URL
  iges_file_path,
  // called when load is complete
  function (object) {
    sceneGeometry.add(object);
  },
  // called when loading is in progress
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("Error: " + error);
  }
);
```

### TypeScript

```typescript
import * as THREE from "three";
import { IGESLoader } from "three-iges-loader";

const scene = new THREE.Scene();
const loader = new IGESLoader();

loader.load(
  "/path/to/file.iges",
  (geometry: THREE.Group) => {
    scene.add(geometry);
  },
  (xhr: ProgressEvent) => {
    console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
  },
  (error: Error | ErrorEvent) => {
    console.error("Error loading IGES file:", error);
  }
);
```

### Advanced Usage

```typescript
import { IGESLoader, type IGESData } from "three-iges-loader";
import * as THREE from "three";

// With loading manager
const manager = new THREE.LoadingManager();
const loader = new IGESLoader(manager);

// Parse from string
const igesContent = "..."; // IGES file content as string
const geometry = loader.parse(igesContent);
scene.add(geometry);
```

## Development

### Prerequisites

- Node.js >= 18.0.0
- pnpm (recommended) or npm

### Setup

```bash
# Install dependencies
pnpm install

# Build the library
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type check
pnpm type-check

# Lint and format
pnpm lint
pnpm format
```

### Running the Example

The package includes a modern Vite-based example:

```bash
# Start the development server
pnpm dev:example

# Build the example
pnpm build:example
```

Then open http://localhost:3000 in your browser.

## API Reference

### `IGESLoader`

#### Constructor

```typescript
new IGESLoader(manager?: THREE.LoadingManager)
```

#### Methods

**`load(url, onLoad, onProgress?, onError?)`**

Load an IGES file from a URL.

- `url: string` - The URL or path to the IGES file
- `onLoad: (geometry: THREE.Group) => void` - Callback when loading is complete
- `onProgress?: (event: ProgressEvent) => void` - Callback for loading progress
- `onError?: (event: ErrorEvent | Error) => void` - Callback when an error occurs

**`parse(data)`**

Parse IGES file content.

- `data: string` - The IGES file content as string
- Returns: `THREE.Group` - A Three.js Group containing the parsed geometry

### Type Exports

```typescript
import type { EntityAttribute, EntityParam, IGESData } from "three-iges-loader";
```

## Supported IGES Entities

Currently supported entity types:

- ✅ 100 - Circular Arc
- ✅ 106 - Copious Data / Linear Path / Witness Line / Simple Closed Planar Curve
- ✅ 110 - Line
- ✅ 116 - Point
- ✅ 126 - Rational B-Spline Curve
- 🚧 102 - Composite Curve (TODO)
- 🚧 108 - Plane (TODO)
- 🚧 120 - Surface of Revolution (TODO)
- 🚧 122 - Tabulated Cylinder (TODO)
- 🚧 124 - Transformation Matrix (TODO)
- 🚧 128 - Rational B-Spline Surface (TODO)
- 🚧 142 - Curve on Parametric Surface (TODO)
- 🚧 144 - Trimmed Parametric Surface (TODO)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Alex Marinov](https://github.com/alex-marinov)

## Acknowledgments

- Based on the original work by [Alex Marinov](https://github.com/alex-marinov)
- Maintained by [Konsept Design](https://github.com/Konsept-Design)
- Built with [Three.js](https://threejs.org/)

## Resources

- [IGES File Specification](https://wiki.eclipse.org/IGES_file_Specification)
- [IGES Version 5.3 Specification](https://web.archive.org/web/20120821190122/http://www.uspro.org/documents/IGES5-3_forDownload.pdf)
- [IGES Version 6.0 Specification](https://filemonger.com/specs/igs/devdept.com/version6.pdf)
- [IGES on Wikipedia](https://en.wikipedia.org/wiki/IGES)

## Author

Alex Marinov - Konsept Design Limited
