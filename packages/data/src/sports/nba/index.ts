import type { Schema } from "effect";

import { SportsSeed } from "../../schema/sports.js";
import { events } from "./events.js";
import { subjects } from "./subjects.js";

export const nbaSeedCollection = {
  id: "sports.nba",
  subjects,
  events,
} as const satisfies Schema.Codec.Encoded<typeof SportsSeed>;
