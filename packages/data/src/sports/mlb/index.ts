import { SportsSeedEncoded } from "../../schema/sports.js";
import { events } from "./events.js";
import { subjects } from "./subjects.js";

export const mlbCollection = SportsSeedEncoded.make({
  id: "sports.mlb",
  subjects,
  events,
});
