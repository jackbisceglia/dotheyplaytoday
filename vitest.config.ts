import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/**/src/**/*.test.ts"],
    // These files require the removed SQLite harness. They remain checked in
    // for migration to the remote PostgreSQL test strategy.
    exclude: [
      ...configDefaults.exclude,
      "packages/**/src/**/*.sqlite.test.ts",
    ],
  },
});
