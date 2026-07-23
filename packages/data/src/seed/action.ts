import {
  EventsLayer,
  IdLayer,
  SubjectsLayer,
  SubscriptionsLayer,
  UsersLayer,
} from "@dtpt/core";
import { D1DatabaseResource } from "@dtpt/core/lib/database/clients/d1/resource";
import { createD1DatabaseLayerFromResource } from "@dtpt/core/lib/database/service";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { Action } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { Effect, Layer, pipe } from "effect";

import { seedCatalog, summarizeCatalog } from "./catalog.js";
import { reset } from "./reset.js";
import { seedUsers, summarizeUsers } from "./users.js";

const SeedDevLayer = pipe(
  Layer.mergeAll(SubjectsLayer, EventsLayer, UsersLayer, SubscriptionsLayer),
  Layer.provide(IdLayer),
  Layer.provide(CloudflareCryptoLayer),
);

const SeedProductionLayer = pipe(
  Layer.mergeAll(SubjectsLayer, EventsLayer),
  Layer.provide(IdLayer),
  Layer.provide(CloudflareCryptoLayer),
);

export const SeedDev = Action(
  "SeedDev",
  Effect.gen(function* () {
    const database = yield* Cloudflare.D1.QueryDatabase(D1DatabaseResource);

    return Effect.fn("SeedDev.Run")(function* (input: { version: string }) {
      yield* Effect.log("Seeding development data...", input);

      const SeedLayer = SeedDevLayer.pipe(
        Layer.provideMerge(createD1DatabaseLayerFromResource(database)),
      );

      yield* Effect.gen(function* () {
        yield* reset();

        const collections = yield* seedCatalog();
        yield* Effect.log(summarizeCatalog(collections));

        const users = yield* seedUsers();
        yield* Effect.log(summarizeUsers(users));
      }).pipe(Effect.provide(SeedLayer));
    });
  }).pipe(Effect.provide(Cloudflare.D1.QueryDatabaseLocal)),
);

export const SeedProduction = Action(
  "SeedProduction",
  Effect.gen(function* () {
    const database = yield* Cloudflare.D1.QueryDatabase(D1DatabaseResource);

    return Effect.fn("SeedProduction.Run")(function* (input: {
      version: string;
    }) {
      yield* Effect.log("Seeding production catalog...", input);

      const SeedLayer = SeedProductionLayer.pipe(
        Layer.provideMerge(createD1DatabaseLayerFromResource(database)),
      );

      const collections = yield* seedCatalog().pipe(Effect.provide(SeedLayer));
      yield* Effect.log(summarizeCatalog(collections));
    });
  }).pipe(Effect.provide(Cloudflare.D1.QueryDatabaseLocal)),
);
