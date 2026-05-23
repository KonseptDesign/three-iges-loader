import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "iges-core",
    globals: true,
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
