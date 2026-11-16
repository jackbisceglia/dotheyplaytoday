import { SportsSeedEncoded } from "../../schema/sports.js";
import { events } from "./events.js";
import { subjects } from "./subjects.js";

export const ncaafCollection = SportsSeedEncoded.make({
  id: "sports.ncaaf",
  subjects,
  events,
});
