import { Config, Effect, Option, Schema, SchemaIssue } from "effect";
import { Path } from "effect/Path";

const MONOREPO_ROOT_URL = new URL("../../../../../", import.meta.url);

export type DatabaseConfig = Config.Success<typeof DatabaseConfig>;
export const DatabaseConfig = Config.all({
  file: Config.string("DATABASE_FILE").pipe(Config.option),
  url: Config.string("DATABASE_URL").pipe(Config.option),
}).pipe(
  Config.mapOrFail((config) => {
    const bothSome = Option.isSome(config.file) && Option.isSome(config.url);
    const bothNone = Option.isNone(config.file) && Option.isNone(config.url);

    if (bothSome || bothNone) {
      const issue = new SchemaIssue.InvalidValue(Option.none(), {
        message: "Set exactly one of DATABASE_FILE or DATABASE_URL.",
      });
      const schemaError = new Schema.SchemaError(issue);
      const configError = new Config.ConfigError(schemaError);

      return Effect.fail(configError);
    }

    return Effect.succeed(config);
  }),
);

/**
 * Config only decides which input is valid. File path normalization stays here
 * because it adapts the validated config value for the sqlite client.
 */
const resolveDatabaseFilePath = Effect.fn(
  "DatabaseConfig.resolveDatabaseFilePath",
)(
  function* (databaseFile: string) {
    const path = yield* Path;

    if (path.isAbsolute(databaseFile)) {
      return databaseFile;
    }

    const monorepoRoot = yield* path.fromFileUrl(MONOREPO_ROOT_URL);

    return path.join(monorepoRoot, databaseFile);
  },
);

/**
 * Computes the sqlite client connection value from a validated config. The
 * config parser enforces that exactly one of file or url is present.
 */
export const DatabaseConnection = Effect.gen(function* () {
  const config = yield* DatabaseConfig;

  if (Option.isSome(config.url)) {
    return config.url.value;
  }

  if (Option.isSome(config.file)) {
    return yield* resolveDatabaseFilePath(config.file.value);
  }

  return yield* Effect.die("Expected DATABASE_FILE or DATABASE_URL.");
});
