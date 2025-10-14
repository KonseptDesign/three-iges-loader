import { defineConfig } from "vite";

export default defineConfig({
  root: "example",
  server: {
    port: 3000,
    open: "/index-vite.html",
  },
  build: {
    outDir: "../dist-example",
    emptyOutDir: true,
  },
  assetsInclude: ["**/*.iges"],
});
