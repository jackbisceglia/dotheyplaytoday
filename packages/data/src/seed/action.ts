import {
  EventsLayer,
  IdLayer,
  SubjectsLayer,
  SubscriptionsLayer,
  UsersLayer,
} from "@dtpt/core";
import { createD1HttpDatabaseLayer } from "@dtpt/core/lib/database/clients/d1/http-binding";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { Action } from "alchemy";
import { Effect, Layer, pipe } from "effect";

import { seedCatalog, summarizeCatalog } from "./catalog.js";
import { reset } from "./reset.js";
import { seedUsers, summarizeUsers } from "./users.js";

const SeedDependenciesLayer = pipe(
  Layer.mergeAll(SubjectsLayer, EventsLayer, UsersLayer, SubscriptionsLayer),
  Layer.provide(IdLayer),
  Layer.provide(CloudflareCryptoLayer),
);

// TODO(alchemy): once Actions can bind D1 directly, replace the HTTP layer
// with Cloudflare.D1.QueryDatabase(D1DatabaseResource) +
// createD1DatabaseLayerFromResource and drop the accountId/databaseId inputs.
export default Action(
  "Seed",
  Effect.succeed(
    Effect.fn("DataSeed.dev")(function* (input: {
      accountId: string;
      databaseId: string;
      appliedAt: string;
    }) {
      const SeedLayer = SeedDependenciesLayer.pipe(
        Layer.provideMerge(createD1HttpDatabaseLayer(input)),
      );

      yield* Effect.gen(function* () {
        yield* reset();

        const collections = yield* seedCatalog();
        yield* Effect.log(summarizeCatalog(collections));

        const users = yield* seedUsers();
        yield* Effect.log(summarizeUsers(users));
      }).pipe(Effect.provide(SeedLayer));
    }),
  ),
);
