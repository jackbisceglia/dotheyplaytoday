import {
  EventsLayer,
  IdLayer,
  SubjectsLayer,
  SubscriptionsLayer,
  UsersLayer,
} from "@dtpt/core";
import { createD1DatabaseLayerFromResource } from "@dtpt/core/lib/database/clients/d1/layer";
import { D1DatabaseResource } from "@dtpt/core/lib/database/clients/d1/resource";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { Action } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { Effect, Layer, pipe } from "effect";

import { seedCatalog, summarizeCatalog } from "./catalog.js";
import { reset } from "./reset.js";
import { seedUsers, summarizeUsers } from "./users.js";

const SeedBaseLayer = pipe(
  Layer.mergeAll(SubjectsLayer, EventsLayer, UsersLayer, SubscriptionsLayer),
  Layer.provide(IdLayer),
  Layer.provide(CloudflareCryptoLayer),
);

export default Action(
  "Seed",
  Effect.gen(function* () {
    const database = yield* Cloudflare.D1.QueryDatabase(D1DatabaseResource);

    return Effect.fn("Seed.Run")(function* (input: {
      mode: "dev" | "prod";
      version: string;
    }) {
      yield* Effect.log("Seeding...", input);

      const SeedLayer = SeedBaseLayer.pipe(
        Layer.provideMerge(createD1DatabaseLayerFromResource(database)),
      );

      yield* Effect.gen(function* () {
        if (input.mode === "dev") {
          yield* reset();
        }

        const collections = yield* seedCatalog();
        yield* Effect.log(summarizeCatalog(collections));

        if (input.mode === "dev") {
          const users = yield* seedUsers();
          yield* Effect.log(summarizeUsers(users));
        }
      }).pipe(Effect.provide(SeedLayer));
    });
  }).pipe(Effect.provide(Cloudflare.D1.QueryDatabaseLocal)),
);
