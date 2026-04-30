import { Path } from "@effect/platform";
import { Config, Effect } from "effect";

const LocalDatabasePath = Path.Path.pipe(
  Effect.map((path) =>
    path.join(
      import.meta.dirname,
      "..",
      "..",
      "..",
      "data",
      "sqlite",
      "dotheyplaytoday.sqlite",
    ),
  ),
);

export const localDatabasePath = Effect.runSync(
  LocalDatabasePath.pipe(Effect.provide(Path.layer)),
);

export const DatabaseConfig = Config.all({
  url: Config.string("DATABASE_URL").pipe(
    Config.withDefault(localDatabasePath),
  ),
});

export const DatabaseUrl = DatabaseConfig.pipe(Config.map((c) => c.url));
