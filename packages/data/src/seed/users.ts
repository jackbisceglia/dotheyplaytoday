import {
  StringParts,
  SubscriptionInsert,
  Subscriptions,
  type User,
  UserInsert,
  Users as UsersService,
} from "@dtpt/core";
import { Effect, Schema, Struct } from "effect";

import { Teams } from "../sports/mlb/subjects.js";
import { SeedConfig } from "./config.js";

const UserSeed = Schema.Struct({
  ...Struct.omit(UserInsert.fields, ["id", "unsubscribeToken"]),
  subjectIds: Schema.NonEmptyArray(SubscriptionInsert.fields.subjectId),
  schedule: SubscriptionInsert.fields.schedule,
});

type UserSeed = typeof UserSeed.Type;

const DefaultSeedUsers = Effect.gen(function* () {
  const config = yield* SeedConfig;

  return Schema.decodeUnknownSync(Schema.NonEmptyArray(UserSeed))([
    {
      email: config.email,
      timezone: "America/New_York",
      subjectIds: [Teams.BostonRedSox.id],
      schedule: {
        _tag: "fixed_local_time",
        sendAtSecondsLocal: 11 * 60 * 60 + 45 * 60,
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

  return yield* Effect.forEach(decodedUsers, (seedUser) =>
    Effect.gen(function* () {
      const signupUser = yield* users.upsertForSignup(
        seedUser.email,
        seedUser.timezone,
      );
      const user = signupUser.user;

      yield* subscriptions.replaceForUser({
        user,
        subjectIds: seedUser.subjectIds,
        schedule: seedUser.schedule,
      });

      return user;
    }),
  );
});
