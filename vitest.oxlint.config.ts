import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tooling/oxlint/anti-slop/**/*.test.ts"],
    setupFiles: ["tooling/oxlint/test-setup.ts"],
  },
});
