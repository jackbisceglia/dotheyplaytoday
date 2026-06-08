import { describe, expect, it } from "@effect/vitest";
import {
  Database,
  EventsLayer,
  SubjectId,
  SubjectsLayer,
  SubscriptionsLayer,
  subscriptionsTable,
  UsersLayer,
  usersTable,
} from "@dtpt/core-v2";
import {
  createTables,
  layerTest,
} from "@dtpt/core-v2/lib/database/__tests__/setup";
import { Effect, Layer, Schema } from "effect";

import { SportsSeed } from "../../schema/sports.js";
import { nbaSeedCollection } from "../../sports/nba/index.js";
import { Teams } from "../../sports/nba/subjects.js";
import { seedCatalog } from "../catalog.js";
import { seedUsers, summarizeUsers, Users } from "../users.js";

type SportsSeedInput = Schema.Codec.Encoded<typeof SportsSeed>;

const layerSeedTest = Layer.mergeAll(
  SubjectsLayer,
  EventsLayer,
  UsersLayer,
  SubscriptionsLayer,
).pipe(Layer.provideMerge(layerTest));

const seedNbaCatalog = seedCatalog([
  nbaSeedCollection satisfies SportsSeedInput,
]);

describe("seed users", () => {
  it.effect("seeds users with one or more subject subscriptions", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedNbaCatalog;

      const seededUsers = yield* seedUsers([
        {
          ...Users[0],
          subjectIds: [
            SubjectId.make(Teams.SanAntonioSpurs.id),
            SubjectId.make(Teams.NewYorkKnicks.id),
          ],
        },
      ]);

      const database = yield* Database;
      const [users, subscriptions] = yield* Effect.all([
        database.select().from(usersTable),
        database.select().from(subscriptionsTable),
      ]);

      expect(users).toHaveLength(1);
      expect(seededUsers).toHaveLength(1);
      expect(summarizeUsers(seededUsers)).toBe("seed:users users=1");
      expect(users[0]?.email).toBe("jackbisceglia2000@gmail.com");
      expect(seededUsers[0]?.email).toBe("jackbisceglia2000@gmail.com");
      expect(
        subscriptions.map((subscription) => subscription.subjectId).sort(),
      ).toEqual([Teams.NewYorkKnicks.id, Teams.SanAntonioSpurs.id].sort());
    }).pipe(Effect.provide(layerSeedTest)),
  );

  it.effect("replaces subscriptions when a seeded user changes", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedNbaCatalog;

      yield* seedUsers([
        {
          ...Users[0],
          subjectIds: [
            SubjectId.make(Teams.SanAntonioSpurs.id),
            SubjectId.make(Teams.NewYorkKnicks.id),
          ],
        },
      ]);
      yield* seedUsers(Users);

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
