import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, Effect, Layer, Option } from "effect";
import { Path, layer as PathLayer } from "effect/Path";

import { DatabaseConfig, DatabaseConnection } from "../config.js";

const ConfigLayerTest = (env: Record<string, string>): Layer.Layer<Path> =>
  Layer.mergeAll(
    ConfigProvider.layer(ConfigProvider.fromEnv({ env })),
    PathLayer,
  );

describe("v2 database config", () => {
  it.effect("resolves DATABASE_FILE relative to the repository root", () =>
    Effect.gen(function* () {
      const connection = yield* DatabaseConnection;
      const path = yield* Path;
      const repositoryRoot = yield* path.fromFileUrl(
        new URL("../../../../../../", import.meta.url),
      );

      expect(connection).toBe(
        path.join(repositoryRoot, "packages/data/dev.sqlite"),
      );
    }).pipe(
      Effect.provide(
        ConfigLayerTest({
          DATABASE_FILE: "packages/data/dev.sqlite",
        }),
      ),
    ),
  );

  it.effect("passes absolute file paths and in-memory URLs through", () =>
    Effect.gen(function* () {
      const absoluteConnection = yield* DatabaseConnection.pipe(
        Effect.provide(
          ConfigLayerTest({
            DATABASE_FILE: "/tmp/dtpt.sqlite",
          }),
        ),
      );
      const memoryConnection = yield* DatabaseConnection.pipe(
        Effect.provide(
          ConfigLayerTest({
            DATABASE_URL: ":memory:",
          }),
        ),
      );

      expect(absoluteConnection).toBe("/tmp/dtpt.sqlite");
      expect(memoryConnection).toBe(":memory:");
    }),
  );

  it.effect("passes DATABASE_URL through without path resolution", () =>
    Effect.gen(function* () {
      const config = yield* DatabaseConfig;
      const connection = yield* DatabaseConnection;

      expect(Option.getOrUndefined(config.url)).toBe("libsql://example.turso.io");
      expect(connection).toBe("libsql://example.turso.io");
    }).pipe(
      Effect.provide(
        ConfigLayerTest({
          DATABASE_URL: "libsql://example.turso.io",
        }),
      ),
    ),
  );

  it.effect("requires exactly one database location", () =>
    Effect.gen(function* () {
      const loadDatabaseConfig = Effect.gen(function* () {
        return yield* DatabaseConfig;
      });

      const missingExit = yield* loadDatabaseConfig.pipe(
        Effect.provide(ConfigLayerTest({})),
        Effect.exit,
      );
      const bothExit = yield* loadDatabaseConfig.pipe(
        Effect.provide(
          ConfigLayerTest({
            DATABASE_FILE: "packages/data/dev.sqlite",
            DATABASE_URL: "libsql://example.turso.io",
          }),
        ),
        Effect.exit,
      );

      expect(missingExit._tag).toBe("Failure");
      expect(bothExit._tag).toBe("Failure");
    }),
  );
});
