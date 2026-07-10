import { ALCHEMY_PHASE } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { Effect } from "effect";
import * as Path from "effect/Path";

/**
 * Resolves migrations while Alchemy plans the D1 resource. The shared resource
 * also runs inside the Worker, where repository files do not exist.
 */
const MigrationsDirByPhase = Effect.gen(function* () {
  const path = yield* Path.Path;
  const phase = yield* ALCHEMY_PHASE;

  if (phase === "runtime") {
    return "";
  }

  return yield* path
    .fromFileUrl(
      new URL("../../../../../../data/migrations", import.meta.url),
    )
    .pipe(Effect.orDie);
});

/** Shared Cloudflare D1 resource for provisioning and Worker bindings. */
export const D1DatabaseResource = Cloudflare.D1.Database(
  "DtptDatabase",
  Effect.gen(function* () {
    const migrationsDir = yield* MigrationsDirByPhase;

    return {
      migrationsDir,
      primaryLocationHint: "wnam" as const,
    };
  }).pipe(Effect.provide(Path.layer)),
);
