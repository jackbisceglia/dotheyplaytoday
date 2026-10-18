import { MmaSeedEncoded } from "../../schema/mma.js";
import { events } from "./events.js";
import { subjects } from "./subjects.js";

export const ufcCollection = MmaSeedEncoded.make({
  id: "mma.ufc",
  subjects,
  events,
});
