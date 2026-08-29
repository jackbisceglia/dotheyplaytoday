import { SportsSeedEncoded } from "../../schema/sports.js";
import { events } from "./events.js";
import { subjects } from "./subjects.js";

export const nhlCollection = SportsSeedEncoded.make({
  id: "sports.nhl",
  subjects,
  events,
});
