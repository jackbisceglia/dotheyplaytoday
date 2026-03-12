import { Config, Schema } from "effect";

import { KvsOption } from "./service.js";

export const KvsOverride = Schema.Config("KVS", KvsOption).pipe(
  Config.withDefault(undefined),
);
