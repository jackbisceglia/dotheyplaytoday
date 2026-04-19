import { FileSystem, KeyValueStore, Path } from "@effect/platform";
import { NodeContext } from "@effect/platform-node";
import { describe, expect, it } from "@effect/vitest";
import { RedisClient } from "@dtpt/core/modules/kvs/providers/redis/client";
import { KeyValueStoreRedis } from "@dtpt/core/modules/kvs/providers/redis/service";
import { ConfigProvider, Effect, Either, Layer, Option, Schema } from "effect";

import { migrate } from "./index.js";

const encodeJson = Schema.encodeUnknownSync(Schema.parseJson(Schema.Unknown));
const decodeJson = Schema.decodeUnknownSync(Schema.parseJson(Schema.Unknown));

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const patternToRegex = (pattern: string) =>
  new RegExp(
    `^${pattern
      .split("*")
      .map((segment) => escapeRegExp(segment))
      .join(".*")}$`,
  );

const makeRedisMock = () => {
  const store = new Map<string, string>();

  const client = {
    get: (key: string) => Promise.resolve(store.get(key) ?? null),
    set: (key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve("OK");
    },
    del: (...keys: string[]) => {
      let deleted = 0;
      for (const key of keys) {
        if (store.delete(key)) {
          deleted += 1;
        }
      }

      return Promise.resolve(deleted);
    },
    scan: (
      _cursor: string,
      _matchKeyword: string,
      pattern: string,
      _countKeyword: string,
      _count: string,
    ) =>
      Promise.resolve([
        "0",
        [...store.keys()].filter((key) => patternToRegex(pattern).test(key)),
      ] as [string, string[]]),
  } as unknown as typeof RedisClient.Service;

  return { client, store };
};

const makeProgramLayer = (client: typeof RedisClient.Service) => {
  const RedisClientLayerTest = Layer.succeed(RedisClient, client);
  const KeyValueStoreLayerTest = KeyValueStoreRedis.layer("dtpt").pipe(
    Layer.provide(RedisClientLayerTest),
  );
  const ConfigProviderLayerTest = Layer.setConfigProvider(
    ConfigProvider.fromMap(
      new Map([
        // migrate still targets Redis, so these values satisfy the Redis config
        // reads used by RedisClientIoredisConfig / RedisKeyValueStoreConfig.
        ["REDIS_URL", "redis://localhost:6379"],
        ["REDIS_KEY_PREFIX", "dtpt"],
      ]),
    ),
  );

  return Layer.mergeAll(
    RedisClientLayerTest,
    KeyValueStoreLayerTest,
    NodeContext.layer,
    ConfigProviderLayerTest,
  );
};

const withSourceDirectory = <A, E, R>(
  seed: Record<string, unknown>,
  run: (sourceDirectory: string) => Effect.Effect<A, E, R>,
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const path = yield* Path.Path;
      const sourceDirectory = yield* fs.makeTempDirectoryScoped({
        prefix: "dtpt-migrate-test-",
      });

      yield* Effect.forEach(
        Object.entries(seed),
        ([key, value]) =>
          fs.writeFileString(
            path.join(sourceDirectory, encodeURIComponent(key)),
            encodeJson(value),
          ),
        { discard: true },
      );

      return yield* run(sourceDirectory);
    }),
  ).pipe(Effect.provide(NodeContext.layer));

const expectJsonValue = (actual: Option.Option<string>, expected: unknown) => {
  expect(Option.isSome(actual)).toBe(true);
  if (Option.isSome(actual)) {
    expect(decodeJson(actual.value)).toEqual(expected);
  }
};

const expectMissingValue = (actual: Option.Option<string>) => {
  expect(Option.isNone(actual)).toBe(true);
};

describe("migrate", () => {
  it.effect(
    "migrates topics by default and leaves users/subscriptions untouched",
    () => {
      const redisMock = makeRedisMock();
      const ProgramLayerTest = makeProgramLayer(redisMock.client);

      const existingUsers = [{ id: "old-user" }];
      const existingSubscriptions = [{ id: "old-subscription" }];
      const staleTopic = { events: [{ id: "stale-event" }] };
      const sourceTopicA = { events: [{ id: "topic-a-event" }] };
      const sourceTopicB = { events: [{ id: "topic-b-event" }] };

      const sourceSeed = {
        users: [{ id: "new-user" }],
        subscriptions: [{ id: "new-subscription" }],
        "topics/topic-a": sourceTopicA,
        "topics/topic-b": sourceTopicB,
      };

      return withSourceDirectory(sourceSeed, (sourceDirectory) =>
        Effect.gen(function* () {
          const keyValueStore = yield* KeyValueStore.KeyValueStore;

          yield* keyValueStore.set("users", encodeJson(existingUsers));
          yield* keyValueStore.set(
            "subscriptions",
            encodeJson(existingSubscriptions),
          );
          yield* keyValueStore.set("topics/stale", encodeJson(staleTopic));

          const result = yield* migrate({
            dynamic: false,
            reset: false,
            confirmReset: false,
            sourceDirectory,
            keyPrefix: "dtpt",
          });

          expect(result.topicUpserts).toBe(2);
          expect(result.topicDeleted).toBe(0);
          expect(result.dynamicReplaced).toBe(0);

          const [users, subscriptions, topicA, topicB, topicStale] =
            yield* Effect.all([
              keyValueStore.get("users"),
              keyValueStore.get("subscriptions"),
              keyValueStore.get("topics/topic-a"),
              keyValueStore.get("topics/topic-b"),
              keyValueStore.get("topics/stale"),
            ]);

          expectJsonValue(users, existingUsers);
          expectJsonValue(subscriptions, existingSubscriptions);
          expectJsonValue(topicA, sourceTopicA);
          expectJsonValue(topicB, sourceTopicB);
          expectJsonValue(topicStale, staleTopic);
        }).pipe(Effect.provide(ProgramLayerTest)),
      );
    },
  );

  it.effect(
    "replaces users/subscriptions only when --dynamic is enabled",
    () => {
      const redisMock = makeRedisMock();
      const ProgramLayerTest = makeProgramLayer(redisMock.client);

      const sourceUsers = [{ id: "new-user" }];
      const sourceSubscriptions = [{ id: "new-subscription" }];

      const sourceSeed = {
        users: sourceUsers,
        subscriptions: sourceSubscriptions,
        "topics/topic-a": { events: [{ id: "topic-a-event" }] },
      };

      return withSourceDirectory(sourceSeed, (sourceDirectory) =>
        Effect.gen(function* () {
          const keyValueStore = yield* KeyValueStore.KeyValueStore;

          yield* keyValueStore.set("users", encodeJson([{ id: "old-user" }]));
          yield* keyValueStore.set(
            "subscriptions",
            encodeJson([{ id: "old-subscription" }]),
          );

          const result = yield* migrate({
            dynamic: true,
            reset: false,
            confirmReset: false,
            sourceDirectory,
            keyPrefix: "dtpt",
          });

          expect(result.topicUpserts).toBe(1);
          expect(result.topicDeleted).toBe(0);
          expect(result.dynamicReplaced).toBe(2);

          const [users, subscriptions] = yield* Effect.all([
            keyValueStore.get("users"),
            keyValueStore.get("subscriptions"),
          ]);

          expect(Option.isSome(users)).toBe(true);
          expect(Option.isSome(subscriptions)).toBe(true);
          if (Option.isSome(users)) {
            expect(users.value.includes("\n")).toBe(false);
          }
          if (Option.isSome(subscriptions)) {
            expect(subscriptions.value.includes("\n")).toBe(false);
          }

          expectJsonValue(users, sourceUsers);
          expectJsonValue(subscriptions, sourceSubscriptions);
        }).pipe(Effect.provide(ProgramLayerTest)),
      );
    },
  );

  it.effect("requires confirmation before allowing reset mode", () => {
    const redisMock = makeRedisMock();
    const ProgramLayerTest = makeProgramLayer(redisMock.client);

    const sourceSeed = {
      "topics/topic-a": { events: [{ id: "topic-a-event" }] },
    };

    return withSourceDirectory(sourceSeed, (sourceDirectory) =>
      Effect.gen(function* () {
        const result = yield* Effect.either(
          migrate({
            dynamic: false,
            reset: true,
            confirmReset: false,
            sourceDirectory,
            keyPrefix: "dtpt",
          }),
        );

        Either.match(result, {
          onLeft: (error) => {
            expect(error._tag).toBe("MigrateResetConfirmationRequired");
          },
          onRight: () =>
            expect.fail(
              "Expected migrate to reject reset without confirmation",
            ),
        });
      }).pipe(Effect.provide(ProgramLayerTest)),
    );
  });

  it.effect("hard resets topic data when reset is confirmed", () => {
    const redisMock = makeRedisMock();
    const ProgramLayerTest = makeProgramLayer(redisMock.client);

    const sourceTopicA = { events: [{ id: "topic-a-event" }] };
    const sourceSeed = {
      "topics/topic-a": sourceTopicA,
    };

    return withSourceDirectory(sourceSeed, (sourceDirectory) =>
      Effect.gen(function* () {
        const keyValueStore = yield* KeyValueStore.KeyValueStore;

        const targetSeed: readonly (readonly [string, string])[] = [
          ["topics/topic-a", encodeJson({ events: [{ id: "old-a" }] })],
          ["topics/stale", encodeJson({ events: [{ id: "stale" }] })],
          ["users", encodeJson([{ id: "old-user" }])],
        ];

        yield* Effect.forEach(
          targetSeed,
          ([key, value]) => keyValueStore.set(key, value),
          { discard: true },
        );

        const result = yield* migrate({
          dynamic: false,
          reset: true,
          confirmReset: true,
          sourceDirectory,
          keyPrefix: "dtpt",
        });

        expect(result.topicUpserts).toBe(1);
        expect(result.topicDeleted).toBe(2);
        expect(result.dynamicReplaced).toBe(0);

        const [topicA, staleTopic, users] = yield* Effect.all([
          keyValueStore.get("topics/topic-a"),
          keyValueStore.get("topics/stale"),
          keyValueStore.get("users"),
        ]);

        expectJsonValue(topicA, sourceTopicA);
        expectMissingValue(staleTopic);
        expectJsonValue(users, [{ id: "old-user" }]);
      }).pipe(Effect.provide(ProgramLayerTest)),
    );
  });
});
