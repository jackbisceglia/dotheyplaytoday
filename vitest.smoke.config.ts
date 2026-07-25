import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/postgres.smoke.test.ts"],
  },
});
