import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/**/src/tests/**/*.test.ts"],
  },
});
