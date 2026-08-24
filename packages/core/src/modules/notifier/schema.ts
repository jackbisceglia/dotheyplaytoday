import { Schema } from "effect";

export type Recipient = typeof Recipient.Type;
/** A provider-neutral notification recipient identifier. */
export const Recipient = Schema.String.pipe(Schema.brand("Recipient"));
