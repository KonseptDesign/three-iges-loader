import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "iges-core": path.resolve(rootDir, "packages/iges-core/src/index.ts"),
    },
  },
  test: {
    name: "three-iges-loader",
    globals: true,
    environment: "node",
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "test/", "dist/", "**/*.config.*", "**/*.d.ts"],
    },
  },
});
