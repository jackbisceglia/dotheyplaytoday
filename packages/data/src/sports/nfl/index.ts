import { SportsSeedEncoded } from "../../schema/sports.js";
import { events } from "./events.js";
import { subjects } from "./subjects.js";

export const nflCollection = SportsSeedEncoded.make({
  id: "sports.nfl",
  subjects,
  events,
});
