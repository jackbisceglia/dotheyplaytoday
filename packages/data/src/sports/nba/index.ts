import { SportsSeedEncoded } from "../../schema/sports.js";
import { events } from "./events.js";
import { subjects } from "./subjects.js";

export const nbaCollection = SportsSeedEncoded.make({
  id: "sports.nba",
  subjects,
  events,
});
