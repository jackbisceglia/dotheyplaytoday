import { D1Client } from "@effect/sql-d1";
import { Layer } from "effect";

import { DatabaseLayer } from "./service.js";

export const createD1DatabaseLayer = (
  db: D1Client.D1ClientConfig["db"],
  config?: Omit<D1Client.D1ClientConfig, "db">,
) => Layer.provideMerge(DatabaseLayer, D1Client.layer({ db, ...config }));
