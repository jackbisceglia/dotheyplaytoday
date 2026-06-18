import {
  StringParts,
  SubscriptionInsert,
  Subscriptions,
  type User,
  EmailAddressFromString,
  UserInsert,
  Users as UsersService,
} from "@dtpt/core-v2";
import { Config, Effect, Schema, Struct } from "effect";

import { Teams } from "../sports/nba/subjects.js";

const SeedEmail = Config.schema(EmailAddressFromString, "SEED_EMAIL").pipe(
  Config.withDefault("fan@example.com"),
);

const UserSeed = Schema.Struct({
  ...Struct.omit(UserInsert.fields, ["id", "unsubscribeToken"]),
  subjectIds: Schema.NonEmptyArray(SubscriptionInsert.fields.subjectId),
  schedule: SubscriptionInsert.fields.schedule,
});

type UserSeed = typeof UserSeed.Type;

const DefaultSeedUsers = Effect.gen(function* () {
  const email = yield* SeedEmail;

  return Schema.decodeUnknownSync(Schema.NonEmptyArray(UserSeed))([
    {
      email,
      timezone: "America/New_York",
      subjectIds: [Teams.SanAntonioSpurs.id],
      schedule: {
        _tag: "fixed_local_time",
        sendAtSecondsLocal: 9 * 60 * 60,
      },
    },
  ]);
});

export const summarizeUsers = (users: readonly User[]) =>
  StringParts()
    .add("seed:users")
    .add(`users=${users.length.toString()}`)
    .make();

export const seedUsers = Effect.fn("Seed.Users")(function* (
  input?: readonly UserSeed[],
) {
  const users = yield* UsersService;
  const subscriptions = yield* Subscriptions;

  const decodedUsers = input ?? (yield* DefaultSeedUsers);

  return yield* Effect.forEach(
    decodedUsers,
    (seedUser) =>
      Effect.gen(function* () {
        const user = yield* users.upsertForSignup(
          seedUser.email,
          seedUser.timezone,
        );

        yield* subscriptions.replaceForUser({
          user,
          subjectIds: seedUser.subjectIds,
          schedule: seedUser.schedule,
        });

        return user;
      }),
  );
});
