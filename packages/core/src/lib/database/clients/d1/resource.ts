import * as Cloudflare from "alchemy/Cloudflare";
import { Effect } from "effect";
import * as Path from "effect/Path";

const migrationsDir = Effect.runSync(
  Effect.gen(function* () {
    const path = yield* Path.Path;

    return yield* path.fromFileUrl(
      new URL("../../../../../../data/migrations", import.meta.url),
    );
  }).pipe(Effect.provide(Path.layer)),
);

/** Shared Cloudflare D1 resource for provisioning and Worker bindings. */
export const D1DatabaseResource = Cloudflare.D1.Database("DtptDatabase", {
  migrationsDir,
  primaryLocationHint: "wnam",
});
