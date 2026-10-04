import { EsportsSeedEncoded } from "../../schema/esports.js";
import { events } from "./events.js";
import { subjects } from "./subjects.js";

export const codCollection = EsportsSeedEncoded.make({
  id: "esports.cod",
  subjects,
  events,
});
