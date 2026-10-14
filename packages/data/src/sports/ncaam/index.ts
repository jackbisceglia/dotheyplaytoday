import { SportsSeedEncoded } from "../../schema/sports.js";
import { events } from "./events.js";
import { subjects } from "./subjects.js";

export const ncaamCollection = SportsSeedEncoded.make({
  id: "sports.ncaam",
  subjects,
  events,
});
