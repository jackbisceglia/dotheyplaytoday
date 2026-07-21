import * as Cloudflare from "alchemy/Cloudflare";
import { D1Client } from "@effect/sql-d1";
import type { AnyRelations } from "drizzle-orm";
import * as D1Drizzle from "drizzle-orm/effect-d1";
import { Context, Effect, Layer } from "effect";

import { relations } from "./definitions/relations.js";

type EffectSQLiteDatabase<TRelations extends AnyRelations> =
  D1Drizzle.EffectSQLiteD1Database<TRelations>;

export type Database = EffectSQLiteDatabase<typeof relations>;
export const Database = Context.Service<Database>("@dtpt/core/Database");

/** Creates the database layer from a Cloudflare Worker D1 binding. */
export function createD1DatabaseLayer(
  db: D1Client.D1ClientConfig["db"],
  config?: Omit<D1Client.D1ClientConfig, "db">,
) {
  const D1ClientLayer = D1Client.layer({ db, ...config });
  const DatabaseClientLayer = Layer.effect(
    Database,
    D1Drizzle.makeWithDefaults({ relations }),
  );

  return Layer.provideMerge(DatabaseClientLayer, D1ClientLayer);
}

/** Creates the database layer from a Worker's bound D1 resource. */
export function createD1DatabaseLayerFromResource(
  database: Cloudflare.D1.QueryDatabaseClient,
) {
  return Layer.unwrap(
    database.raw.pipe(Effect.map((binding) => createD1DatabaseLayer(binding))),
  );
}
