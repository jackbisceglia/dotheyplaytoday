import { describe, expect, it } from "@effect/vitest";
import {
  Database,
  EmailAddressFromString,
  EventsLayer,
  SubjectId,
  SubjectsLayer,
  SubscriptionsLayer,
  subscriptionsTable,
  UsersLayer,
  usersTable,
} from "@dtpt/core";
import {
  createTables,
  layerTest,
} from "@dtpt/core/lib/database/__tests__/setup";
import { ConfigProvider, Effect, Layer, Schema } from "effect";

import { SportsSeed } from "../../schema/sports.js";
import { mlbCollection } from "../../sports/mlb/index.js";
import { Teams as MlbTeams } from "../../sports/mlb/subjects.js";
import { nbaCollection } from "../../sports/nba/index.js";
import { Teams } from "../../sports/nba/subjects.js";
import { seedCatalog } from "../catalog.js";
import { seedUsers, summarizeUsers } from "../users.js";

type SportsSeedInput = Schema.Codec.Encoded<typeof SportsSeed>;

const layerSeedTest = Layer.mergeAll(
  SubjectsLayer,
  EventsLayer,
  UsersLayer,
  SubscriptionsLayer,
).pipe(Layer.provideMerge(layerTest));

const seedNbaCatalog = seedCatalog([nbaCollection satisfies SportsSeedInput]);
const seedMlbCatalog = seedCatalog([mlbCollection satisfies SportsSeedInput]);

const layerSeedConfig = (env: Record<string, string>) =>
  ConfigProvider.layer(ConfigProvider.fromEnv({ env }));

const layerSeedTestWithConfig = (env: Record<string, string>) =>
  Layer.mergeAll(layerSeedTest, layerSeedConfig(env));

type SeedUserInput = NonNullable<Parameters<typeof seedUsers>[0]>[number];

const makeSeedUser = (
  overrides: Partial<SeedUserInput> = {},
): SeedUserInput => ({
  email: Schema.decodeUnknownSync(EmailAddressFromString)("fan@example.com"),
  timezone: Schema.decodeUnknownSync(Schema.TimeZoneNamedFromString)(
    "America/New_York",
  ),
  subjectIds: [SubjectId.make(Teams.SanAntonioSpurs.id)],
  schedule: {
    _tag: "fixed_local_time",
    sendAtSecondsLocal: 9 * 60 * 60,
  },
  ...overrides,
});

describe("seed users", () => {
  it.effect("seeds users with one or more subject subscriptions", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedNbaCatalog;

      const seededUsers = yield* seedUsers([
        makeSeedUser({
          subjectIds: [
            SubjectId.make(Teams.SanAntonioSpurs.id),
            SubjectId.make(Teams.NewYorkKnicks.id),
          ],
        }),
      ]);

      const database = yield* Database;
      const [users, subscriptions] = yield* Effect.all([
        database.select().from(usersTable),
        database.select().from(subscriptionsTable),
      ]);

      expect(users).toHaveLength(1);
      expect(seededUsers).toHaveLength(1);
      expect(summarizeUsers(seededUsers)).toBe("seed:users users=1");
      expect(users[0]?.email).toBe("fan@example.com");
      expect(seededUsers[0]?.email).toBe("fan@example.com");
      expect(
        subscriptions.map((subscription) => subscription.subjectId).sort(),
      ).toEqual([Teams.NewYorkKnicks.id, Teams.SanAntonioSpurs.id].sort());
    }).pipe(Effect.provide(layerSeedTest)),
  );

  it.effect("uses the safe fake recipient by default", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedMlbCatalog;

      const seededUsers = yield* seedUsers();

      const database = yield* Database;
      const [users, subscriptions] = yield* Effect.all([
        database.select().from(usersTable),
        database.select().from(subscriptionsTable),
      ]);

      expect(users).toHaveLength(1);
      expect(subscriptions).toHaveLength(1);
      expect(users[0]?.email).toBe("fan@example.com");
      expect(seededUsers[0]?.email).toBe("fan@example.com");
      expect(subscriptions[0]?.subjectId).toBe(MlbTeams.BostonRedSox.id);
    }).pipe(Effect.provide(layerSeedTestWithConfig({}))),
  );

  it.effect("uses SEED_EMAIL for the default dev seed user", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedMlbCatalog;

      const seededUsers = yield* seedUsers();

      const database = yield* Database;
      const users = yield* database.select().from(usersTable);

      expect(users).toHaveLength(1);
      expect(users[0]?.email).toBe("real@example.com");
      expect(seededUsers[0]?.email).toBe("real@example.com");
    }).pipe(
      Effect.provide(
        layerSeedTestWithConfig({ SEED_EMAIL: "real@example.com" }),
      ),
    ),
  );

  it.effect("does not read SEED_EMAIL when explicit seed users are provided", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedNbaCatalog;

      const seededUsers = yield* seedUsers([
        makeSeedUser({
          email: Schema.decodeUnknownSync(EmailAddressFromString)(
            "manual@example.com",
          ),
        }),
      ]);

      const database = yield* Database;
      const users = yield* database.select().from(usersTable);

      expect(users).toHaveLength(1);
      expect(users[0]?.email).toBe("manual@example.com");
      expect(seededUsers[0]?.email).toBe("manual@example.com");
    }).pipe(
      Effect.provide(
        layerSeedTestWithConfig({ SEED_EMAIL: "real@example.com" }),
      ),
    ),
  );

  it.effect("replaces subscriptions when a seeded user changes", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedNbaCatalog;

      yield* seedUsers([
        makeSeedUser({
          subjectIds: [
            SubjectId.make(Teams.SanAntonioSpurs.id),
            SubjectId.make(Teams.NewYorkKnicks.id),
          ],
        }),
      ]);
      yield* seedUsers([makeSeedUser()]);

      const database = yield* Database;
      const [users, subscriptions] = yield* Effect.all([
        database.select().from(usersTable),
        database.select().from(subscriptionsTable),
      ]);

      expect(users).toHaveLength(1);
      expect(subscriptions).toHaveLength(1);
      expect(subscriptions[0]?.subjectId).toBe(Teams.SanAntonioSpurs.id);
    }).pipe(Effect.provide(layerSeedTest)),
  );
});
