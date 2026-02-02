import { Schema } from "effect";

const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type User = Schema.Schema.Type<typeof User>;
export const User = Schema.Struct({
  id: Schema.UUID.pipe(Schema.brand("UserId")),
  email: Schema.String.pipe(
    Schema.pattern(emailRegex, {
      identifier: "EmailAddress",
      description: "an email address",
    }),
  ),
  timezone: Schema.TimeZoneNamed,
});
