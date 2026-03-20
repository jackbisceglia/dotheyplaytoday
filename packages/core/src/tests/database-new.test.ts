import { KeyValueStore } from "@effect/platform";
import { describe, expect, it } from "@effect/vitest";
import { Effect, Either, Layer, Schema } from "effect";

import {
  createDatabaseRegistry,
  type DatabaseRegistry,
} from "../modules/database-new/registry.js";
import { Database } from "../modules/database/service.js";
import { Topic } from "../modules/topics/schema.js";
import { User } from "../modules/users/schema.js";

const decode = Schema.decodeUnknownSync;

const sampleIds = {
  userId: "00000000-0000-4000-8000-000000000511",
  topicId: "00000000-0000-4000-8000-000000000512",
};

const sampleUser = decode(User)({
  id: sampleIds.userId,
  email: "fan@example.com",
  timezone: "America/New_York",
});

const sampleTopic = decode(Topic)({
  id: sampleIds.topicId,
  events: [],
});

const KeyValueStoreLayerTest = KeyValueStore.layerMemory;

const DatabaseLayerTest = Layer.mergeAll(
  KeyValueStoreLayerTest,
  Database.Default.pipe(Layer.provide(KeyValueStoreLayerTest)),
);

const databaseRegistry = createDatabaseRegistry();

describe("Database registry", () => {
  it("resolves key selectors to document keys", () => {
    const userKey = databaseRegistry.selectors.user(sampleUser.id);
    const userByEmailKey = databaseRegistry.selectors.userByEmail(
      sampleUser.email,
    );
    const topicKey = databaseRegistry.selectors.topic(sampleTopic.id);

    expect(userKey).toBe(`user:${sampleUser.id}`);
    expect(userByEmailKey).toBe(`index:userByEmail:${sampleUser.email}`);
    expect(topicKey).toBe(`topic:${sampleTopic.id}`);
  });
});

describe("Database", () => {
  it.effect("writes then reads typed documents by key selector", () =>
    Effect.gen(function* () {
      const database = yield* Database;
      const selectUserKey = (selectors: DatabaseRegistry["selectors"]) =>
        selectors.user(sampleUser.id);

      yield* database.setWithSchema(selectUserKey, User, sampleUser);
      const loaded = yield* database.getWithSchema(selectUserKey, User);

      expect(loaded).toEqual(sampleUser);
    }).pipe(Effect.provide(DatabaseLayerTest)),
  );

  it.effect("returns DataFileNotFound for missing key selector", () =>
    Effect.gen(function* () {
      const database = yield* Database;
      const result = yield* Effect.either(
        database.getWithSchema(
          (selectors) => selectors.topic(sampleTopic.id),
          Topic,
        ),
      );

      Either.match(result, {
        onLeft: (error) => {
          switch (error._tag) {
            case "DataFileNotFound": {
              expect(error.path).toBe(`topic:${sampleTopic.id}`);
              break;
            }
            default:
              expect.fail(`Expected DataFileNotFound, got ${error._tag}`);
          }
        },
        onRight: () => expect.fail("Expected getWithSchema to fail"),
      });
    }).pipe(Effect.provide(DatabaseLayerTest)),
  );

  it.effect("returns DataValidationError for invalid document payload", () =>
    Effect.gen(function* () {
      const kv = yield* KeyValueStore.KeyValueStore;
      const database = yield* Database;
      const selectUserKey = (selectors: DatabaseRegistry["selectors"]) =>
        selectors.user(sampleUser.id);

      yield* kv.set(selectUserKey(databaseRegistry.selectors), '{"id": 42}');

      const result = yield* Effect.either(
        database.getWithSchema(selectUserKey, User),
      );

      Either.match(result, {
        onLeft: (error) => {
          switch (error._tag) {
            case "DataValidationError": {
              expect(error.path).toBe(`user:${sampleUser.id}`);
              break;
            }
            default:
              expect.fail(`Expected DataValidationError, got ${error._tag}`);
          }
        },
        onRight: () => expect.fail("Expected getWithSchema to fail"),
      });
    }).pipe(Effect.provide(DatabaseLayerTest)),
  );
});
