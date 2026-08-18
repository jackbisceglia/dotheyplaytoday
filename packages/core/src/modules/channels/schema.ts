import { Schema } from "effect";

export type Recipient = typeof Recipient.Type;
export const Recipient = Schema.String.pipe(Schema.brand("Recipient"));
