import { Schema } from "effect";

import { defineDocument, toDocumentKey } from "../database-new/document.js";
import { Event } from "../events/schema.js";

export type Topic = Schema.Schema.Type<typeof Topic>;
export const Topic = Schema.Struct({
  id: Schema.UUID.pipe(Schema.brand("TopicId")),
  events: Schema.Array(Event),
});

export const TopicDocument = defineDocument({
  name: "topics",
  key: (id: Topic["id"]) => toDocumentKey("topic", id),
});
