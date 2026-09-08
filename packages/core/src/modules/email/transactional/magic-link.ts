import { Schema } from "effect";

import { EmailAddress } from "../../users/schema.js";

export type MagicLink = typeof MagicLink.Type;
export const MagicLink = Schema.Struct({
  recipient: EmailAddress,
  url: Schema.String,
});
