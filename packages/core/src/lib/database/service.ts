import * as Cloudflare from "alchemy/Cloudflare";
import * as Drizzle from "alchemy/Drizzle";
import type { EffectPgDatabase } from "drizzle-orm/effect-postgres";
import { Context, Layer } from "effect";
import type * as Effect from "effect/Effect";
import type * as Redacted from "effect/Redacted";

import { relations } from "./definitions/relations.js";

export type Database = EffectPgDatabase<typeof relations>;
export const Database = Context.Service<Database>("@dtpt/core/Database");

/**
 * Creates the PostgreSQL database layer from a deferred connection URL.
 *
 * Alchemy's bridge opens and closes the pool in the current execution scope,
 * so Worker invocations never share a live connection. The resulting
 * EffectPgDatabase retains Drizzle's interactive transaction API.
 */
export function createPostgresDatabaseLayer<E, R>(
  connectionUrl: Effect.Effect<Redacted.Redacted, E, R>,
) {
  return Layer.effect(Database, Drizzle.postgres(connectionUrl, { relations }));
}

/** Creates the database layer from a Worker's Hyperdrive binding. */
export function createPostgresDatabaseLayerFromHyperdrive(
  connection: Cloudflare.Hyperdrive.ConnectClient,
) {
  return createPostgresDatabaseLayer(connection.connectionString);
}
