import { SportsSeedEncoded } from "../../schema/sports.js";
import { events } from "./events.js";
import { subjects } from "./subjects.js";

export const worldCupCollection = SportsSeedEncoded.make({
  id: "sports.world-cup",
  subjects,
  events,
});
