import { Schema } from "effect";

import { EsportsSeed } from "./esports.js";
import { SportsSeed } from "./sports.js";

export type CatalogSeed = typeof CatalogSeed.Type;
export const CatalogSeed = Schema.Union([SportsSeed, EsportsSeed]);
