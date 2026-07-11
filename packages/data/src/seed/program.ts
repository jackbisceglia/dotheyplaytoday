import {
  EventsLayer,
  IdLayer,
  SubjectsLayer,
  SubscriptionsLayer,
  UsersLayer,
} from "@dtpt/core";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { Effect, Layer, pipe } from "effect";

import { seedCatalog, summarizeCatalog } from "./catalog.js";
import { reset } from "./reset.js";
import { seedUsers, summarizeUsers } from "./users.js";

export type SeedMode = "dev" | "prod";

export const SeedDomainsLayer = pipe(
  Layer.mergeAll(SubjectsLayer, EventsLayer, UsersLayer, SubscriptionsLayer),
  Layer.provide(IdLayer),
  Layer.provide(CloudflareCryptoLayer),
);

export const runSeed = Effect.fn("DataSeed.run")(function* (mode: SeedMode) {
  const summary: string[] = [];

  if (mode === "dev") {
    yield* reset();
  }

  const collections = yield* seedCatalog();
  summary.push(summarizeCatalog(collections));

  if (mode === "dev") {
    const users = yield* seedUsers();
    summary.push(summarizeUsers(users));
  }

  return summary;
});
