import { Schema } from "effect";

import { defineDocument, toDocumentKey } from "../database-new/document.js";

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

export const UserDocument = defineDocument({
  name: "users",
  key: (id: User["id"]) => toDocumentKey("user", id),
  indexes: {
    byEmail: {
      key: (email: User["email"]) =>
        toDocumentKey("index", "userByEmail", email),
    },
  },
});
