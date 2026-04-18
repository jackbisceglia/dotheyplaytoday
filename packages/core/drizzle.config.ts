import { defineConfig } from "drizzle-kit";
import { NodeContext } from "@effect/platform-node";
import { Effect, Layer } from "effect";

import { DatabaseUrl } from "./src/modules/database/config";
import { DotEnvConfigProvider } from "./src/modules/env";

const url = DatabaseUrl.pipe(
  Effect.provide(Layer.provideMerge(DotEnvConfigProvider, NodeContext.layer)),
  Effect.runSync,
);

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/modules/**/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
