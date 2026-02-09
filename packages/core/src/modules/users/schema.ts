import { Schema } from "effect";

const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const EmailAddress = Schema.String.pipe(
  Schema.pattern(emailRegex, {
    identifier: "EmailAddress",
    description: "an email address",
  }),
);

export type User = Schema.Schema.Type<typeof User>;
export const User = Schema.Struct({
  id: Schema.UUID.pipe(Schema.brand("UserId")),
  email: EmailAddress,
  timezone: Schema.TimeZoneNamed,
});
