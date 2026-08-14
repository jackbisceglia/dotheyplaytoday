import * as Cloudflare from "alchemy/Cloudflare";
import * as Drizzle from "alchemy/Drizzle";
import * as PgClient from "@effect/sql-pg/PgClient";
import type { EffectPgDatabase } from "drizzle-orm/effect-postgres";
import { Context, Effect, Layer } from "effect";
import type * as EffectType from "effect/Effect";
import type * as Redacted from "effect/Redacted";

import { relations } from "./definitions/relations.js";

export type Database = EffectPgDatabase<typeof relations> & {
  readonly $client: PgClient.PgClient;
};
export const Database = Context.Service<Database>("@dtpt/core/Database");

/**
 * Creates the PostgreSQL database layer from a deferred connection URL.
 *
 * Alchemy's bridge opens and closes the pool in the current execution scope,
 * so Worker invocations never share a live connection. The resulting
 * EffectPgDatabase retains Drizzle's interactive transaction API, and its
 * exact PgClient is also exposed through the standard Effect SQL services.
 */
export function createDatabaseLayer<E, R>(
  url: EffectType.Effect<Redacted.Redacted, E, R>,
) {
  const DatabaseLayer = Layer.effect(
    Database,
    Drizzle.postgres(url, { relations }),
  );
  const SqlClientLayer = PgClient.layerFrom(
    Effect.map(Database, (database) => database.$client),
  );

  return SqlClientLayer.pipe(Layer.provideMerge(DatabaseLayer));
}

/** Creates the database layer from a Worker's Hyperdrive binding. */
export function createDatabaseLayerFromHyperdriveResource(
  client: Cloudflare.Hyperdrive.ConnectClient,
) {
  return createDatabaseLayer(client.connectionString);
}
