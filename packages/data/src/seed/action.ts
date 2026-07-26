import {
  EventsLayer,
  IdLayer,
  SubjectsLayer,
  SubscriptionsLayer,
  UsersLayer,
} from "@dtpt/core";
import { Planetscale } from "@dtpt/core/lib/database/clients/postgres/resource";
import { createDatabaseLayer } from "@dtpt/core/lib/database/service";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { Action } from "alchemy";
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
    // Resources
    const database = yield* Planetscale;
    const connectionUrl = yield* database.role.connectionUrl;

    // Layers
    const DatabaseLayer = createDatabaseLayer(connectionUrl);
    const SeedLayer = SeedDevLayer.pipe(Layer.provideMerge(DatabaseLayer));

    return Effect.fn("SeedDev.Run")(function* (input: { version: string }) {
      yield* Effect.log("Seeding development data...", input);

      yield* Effect.gen(function* () {
        yield* reset();

        const collections = yield* seedCatalog();
        yield* Effect.log(summarizeCatalog(collections));

        const users = yield* seedUsers();
        yield* Effect.log(summarizeUsers(users));
      }).pipe(Effect.provide(SeedLayer));
    });
  }),
);

export const SeedProduction = Action(
  "SeedProduction",
  Effect.gen(function* () {
    // Resources
    const database = yield* Planetscale;
    const connectionUrl = yield* database.role.connectionUrl;

    // Layers
    const DatabaseLayer = createDatabaseLayer(connectionUrl);
    const SeedLayer = SeedProductionLayer.pipe(
      Layer.provideMerge(DatabaseLayer),
    );

    return Effect.fn("SeedProduction.Run")(function* (input: {
      version: string;
    }) {
      yield* Effect.log("Seeding production catalog...", input);

      const collections = yield* seedCatalog().pipe(Effect.provide(SeedLayer));
      yield* Effect.log(summarizeCatalog(collections));
    });
  }),
);
