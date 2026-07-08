import { Effect, Match, Schema } from "effect";

import { seedCatalog, summarizeCatalog } from "./catalog.js";
import { reset } from "./reset.js";
import { seedUsers, summarizeUsers } from "./users.js";

export const SeedRunOptionFields = {
  mode: Schema.Literals(["dev", "prod"]),
} as const;

export const SeedRunOptions = Schema.Struct({
  mode: SeedRunOptionFields.mode,
});

export type SeedRunOptions = typeof SeedRunOptions.Type;

export const decodeSeedRunOptions = Schema.decodeUnknownEffect(SeedRunOptions);

const runDev = Effect.fn("Seed.Dev")(function* () {
  yield* reset();

  const collections = yield* seedCatalog();
  const users = yield* seedUsers();

  return [summarizeCatalog(collections), summarizeUsers(users)];
});

const runProd = Effect.fn("Seed.Prod")(function* () {
  const collections = yield* seedCatalog();

  return [summarizeCatalog(collections)];
});

/**
 * Runs the seed for the given mode and returns the summary lines. Dev resets
 * the database and seeds catalog plus users; prod only upserts the catalog so
 * users are never seeded outside dev.
 */
export const runSeed = Effect.fn("Seed.Run")(function* (
  options: SeedRunOptions,
) {
  const summary = yield* Match.value(options.mode).pipe(
    Match.when("dev", () => runDev()),
    Match.when("prod", () => runProd()),
    Match.exhaustive,
  );

  yield* Effect.forEach(summary, (line) => Effect.log(line));

  return summary;
});
