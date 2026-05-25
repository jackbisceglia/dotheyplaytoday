import { defineRelations } from "drizzle-orm";

import * as schema from "./schema.js";

export const relations = defineRelations(schema, (d) => ({
  eventsTable: {
    participants: d.many.participantsTable({
      from: d.eventsTable.id,
      to: d.participantsTable.eventId,
    }),
    subjectEvents: d.many.subjectEventsTable({
      from: d.eventsTable.id,
      to: d.subjectEventsTable.eventId,
    }),
  },
}));
