import { defineConfig } from "vite";

export default defineConfig({
  root: "example",
  resolve: {
    alias: {
      "iges-core": new URL("./packages/iges-core/src/index.ts", import.meta.url).pathname,
      "three-iges-loader": new URL("./src/index.ts", import.meta.url).pathname,
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "../dist-example",
    emptyOutDir: true,
  },
  assetsInclude: ["**/*.iges"],
});
