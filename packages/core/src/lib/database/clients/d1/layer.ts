import { D1Client } from "@effect/sql-d1";
import { Layer } from "effect";

import { Database, makeDatabaseClientLayer } from "../../service.js";

/** A Cloudflare Worker D1 binding accepted by the Effect SQL client. */
export type DatabaseBinding = D1Client.D1ClientConfig["db"];

/**
 * Creates a Cloudflare D1-backed database layer from a Worker D1 binding.
 */
export function createD1DatabaseLayer(
  db: DatabaseBinding,
  config?: Omit<D1Client.D1ClientConfig, "db">,
) {
  const D1ClientLayer = D1Client.layer({ db, ...config });
  const DatabaseClientLayer = Layer.effect(Database, makeDatabaseClientLayer());

  return Layer.provideMerge(DatabaseClientLayer, D1ClientLayer);
}
