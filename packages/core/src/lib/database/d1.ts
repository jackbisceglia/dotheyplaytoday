import { D1Client } from "@effect/sql-d1";
import { Layer } from "effect";

import { Database, makeDatabaseClientLayer } from "./service.js";

/**
 * Creates a Cloudflare D1-backed database layer from a Worker D1 binding.
 */
export const createD1DatabaseLayer = (
  db: D1Client.D1ClientConfig["db"],
  config?: Omit<D1Client.D1ClientConfig, "db">,
) => {
  const D1ClientLayer = D1Client.layer({ db, ...config });
  const DatabaseClientLayer = Layer.effect(Database, makeDatabaseClientLayer());

  return Layer.provideMerge(DatabaseClientLayer, D1ClientLayer);
};
