import { Command, Options } from "@effect/cli";
import * as Prompt from "@effect/cli/Prompt";
import { FileSystem, KeyValueStore, Path } from "@effect/platform";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { RedisClient } from "@dtpt/core/modules/kvs/providers/redis/client";
import { RedisClientIoredis } from "@dtpt/core/modules/kvs/providers/redis/client.ioredis";
import {
  RedisClientIoredisConfig,
  RedisKeyValueStoreConfig,
} from "@dtpt/core/modules/kvs/providers/redis/config";
import { KeyValueStoreRedis } from "@dtpt/core/modules/kvs/providers/redis/service";
import { Config, Effect, Layer, Option, Redacted, Schema } from "effect";

import { DotEnvConfigProvider } from "../lib/env.js";

export type MigrateOptions = {
  dynamic: boolean;
  reset: boolean;
  confirmReset?: boolean;
  sourceDirectory?: string;
  keyPrefix?: string;
};

export type MigrateResult = {
  sourceDirectory: string;
  topicUpserts: number;
  topicDeleted: number;
  dynamicReplaced: number;
};

class MigrateResetConfirmationRequired extends Schema.TaggedError<MigrateResetConfirmationRequired>()(
  "MigrateResetConfirmationRequired",
  {
    resetFlag: Schema.String,
    confirmFlag: Schema.String,
  },
) {}

class MigrateSourceKeyMissing extends Schema.TaggedError<MigrateSourceKeyMissing>()(
  "MigrateSourceKeyMissing",
  {
    key: Schema.String,
  },
) {}

class MigrateSourceKeyDecodeError extends Schema.TaggedError<MigrateSourceKeyDecodeError>()(
  "MigrateSourceKeyDecodeError",
  {
    entry: Schema.String,
  },
) {}

class MigrateRedisError extends Schema.TaggedError<MigrateRedisError>()(
  "MigrateRedisError",
  {
    method: Schema.String,
    pattern: Schema.String,
    message: Schema.String,
  },
) {}

class MigrateSourceValueInvalidJson extends Schema.TaggedError<MigrateSourceValueInvalidJson>()(
  "MigrateSourceValueInvalidJson",
  {
    key: Schema.String,
    message: Schema.String,
  },
) {}

class MigrateWriteVerificationError extends Schema.TaggedError<MigrateWriteVerificationError>()(
  "MigrateWriteVerificationError",
  {
    key: Schema.String,
    message: Schema.String,
  },
) {}

const dynamicKeys = ["users", "subscriptions"] as const;

const JsonUnknown = Schema.parseJson(Schema.Unknown);
const decodeJsonUnknown = Schema.decodeUnknownSync(JsonUnknown);
const encodeJsonUnknown = Schema.encodeUnknownSync(JsonUnknown);

const redactRedisTarget = (url: string) => {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return "unknown";
  }
};

const isTopicKey = (key: string) => key.startsWith("topics/");

const makePrefixedKey = (keyPrefix: string, key: string) =>
  [keyPrefix, key].filter((part) => part.length > 0).join(":");

const scanRedisKeys = Effect.fn("migrate.scanRedisKeys")(function* (args: {
  redis: typeof RedisClient.Service;
  pattern: string;
}) {
  const keys: string[] = [];
  let cursor = "0";

  do {
    const [nextCursor, scannedKeys] = yield* Effect.tryPromise({
      try: () =>
        args.redis.scan(
          cursor,
          "MATCH",
          args.pattern,
          "COUNT",
          "100",
        ) as Promise<[string, string[]]>,
      catch: (cause) =>
        MigrateRedisError.make({
          method: "scan",
          pattern: args.pattern,
          message: cause instanceof Error ? cause.message : String(cause),
        }),
    });

    keys.push(...scannedKeys);
    cursor = nextCursor;
  } while (cursor !== "0");

  return keys;
});

const readSourceRecords = Effect.fn("migrate.readSourceRecords")(function* (
  sourceDirectory: string,
) {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  const entries = yield* fs.readDirectory(sourceDirectory);

  return yield* Effect.forEach(entries, (entry) =>
    Effect.gen(function* () {
      const key = yield* Effect.try({
        try: () => decodeURIComponent(entry),
        catch: () => MigrateSourceKeyDecodeError.make({ entry }),
      });
      const value = yield* fs.readFileString(path.join(sourceDirectory, entry));

      return { key, value };
    }),
  );
});

const normalizeJsonSerializedValue = Effect.fn(
  "migrate.normalizeJsonSerializedValue",
)(function* (args: { key: string; value: string }) {
  return yield* Effect.try({
    try: () => encodeJsonUnknown(decodeJsonUnknown(args.value)),
    catch: (cause) =>
      MigrateSourceValueInvalidJson.make({
        key: args.key,
        message: cause instanceof Error ? cause.message : String(cause),
      }),
  });
});

const writeAndVerifyRecord = Effect.fn("migrate.writeAndVerifyRecord")(
  function* (args: {
    key: string;
    value: string;
    keyValueStore: KeyValueStore.KeyValueStore;
  }) {
    const normalizedValue = yield* normalizeJsonSerializedValue({
      key: args.key,
      value: args.value,
    });

    yield* args.keyValueStore.set(args.key, normalizedValue);

    const written = yield* args.keyValueStore.get(args.key);
    if (Option.isNone(written)) {
      return yield* MigrateWriteVerificationError.make({
        key: args.key,
        message: "key missing immediately after write",
      });
    }

    if (written.value !== normalizedValue) {
      return yield* MigrateWriteVerificationError.make({
        key: args.key,
        message: `write mismatch expectedBytes=${normalizedValue.length.toString()} actualBytes=${written.value.length.toString()}`,
      });
    }

    return normalizedValue.length;
  },
);

export const migrate = Effect.fn("migrate")(function* (opts: MigrateOptions) {
  if (opts.reset) {
    const confirmedReset =
      opts.confirmReset ??
      (yield* Prompt.confirm({
        message:
          "Reset will delete all Redis topic keys before import. Continue?",
        initial: false,
      }) as unknown as Effect.Effect<boolean>);

    if (confirmedReset) {
      yield* Effect.logWarning(
        "migrate: reset confirmed, replacing all existing Redis topic keys",
      );
    }

    if (!confirmedReset) {
      yield* Effect.logInfo("migrate: reset cancelled by user");

      return yield* MigrateResetConfirmationRequired.make({
        resetFlag: "--reset",
        confirmFlag: "interactive-confirmation",
      });
    }
  }

  const keyValueStore = yield* KeyValueStore.KeyValueStore;
  const redis = yield* RedisClient;
  const path = yield* Path.Path;
  const sourceDirectory =
    opts.sourceDirectory ??
    path.join(import.meta.dirname, "..", "..", "..", "core", "data", "kv");
  const redisConfig = yield* Config.unwrap(RedisClientIoredisConfig);
  const redisTarget = redactRedisTarget(Redacted.value(redisConfig.url));
  const keyPrefix =
    opts.keyPrefix ??
    (yield* Config.unwrap(RedisKeyValueStoreConfig)).keyPrefix;
  const sourceRecords = yield* readSourceRecords(sourceDirectory);
  const sourceByKey = new Map(
    sourceRecords.map((record) => [record.key, record.value]),
  );
  const topicRecords = sourceRecords.filter((record) => isTopicKey(record.key));

  type DynamicKey = (typeof dynamicKeys)[number];
  const dynamicRecords: { key: DynamicKey; value: string }[] = [];

  if (opts.dynamic) {
    for (const key of dynamicKeys) {
      const value = sourceByKey.get(key);
      if (value === undefined) {
        return yield* MigrateSourceKeyMissing.make({ key });
      }

      dynamicRecords.push({ key, value });
    }
  }

  yield* Effect.logInfo(
    `migrate: start sourceDirectory=${sourceDirectory} redisTarget=${redisTarget} keyPrefix=${keyPrefix} topics=${topicRecords.length.toString()} dynamic=${String(opts.dynamic)} reset=${String(opts.reset)}`,
  );

  let topicDeleted = 0;
  if (opts.reset) {
    const pattern = makePrefixedKey(keyPrefix, "topics/*");
    const existingTopicKeys = yield* scanRedisKeys({ redis, pattern });

    topicDeleted = existingTopicKeys.length;
    if (topicDeleted > 0) {
      yield* Effect.tryPromise({
        try: () => redis.del(...existingTopicKeys),
        catch: (cause) =>
          MigrateRedisError.make({
            method: "del",
            pattern,
            message: cause instanceof Error ? cause.message : String(cause),
          }),
      }).pipe(Effect.asVoid);
    }
  }

  yield* Effect.forEach(
    topicRecords,
    ({ key, value }) => writeAndVerifyRecord({ key, value, keyValueStore }),
    { discard: true },
  );

  yield* Effect.forEach(
    dynamicRecords,
    ({ key, value }) =>
      writeAndVerifyRecord({ key, value, keyValueStore }).pipe(
        Effect.tap((bytes) =>
          Effect.logInfo(
            `migrate: replaced dynamic key=${key} bytes=${bytes.toString()}`,
          ),
        ),
      ),
    { discard: true },
  );

  const result: MigrateResult = {
    sourceDirectory,
    topicUpserts: topicRecords.length,
    topicDeleted,
    dynamicReplaced: dynamicRecords.length,
  };

  yield* Effect.logInfo(
    `migrate: done topicsUpserted=${result.topicUpserts.toString()} topicsDeleted=${result.topicDeleted.toString()} dynamicReplaced=${result.dynamicReplaced.toString()}`,
  );

  return result;
});

const MigrateCommand = Command.make(
  "migrate",
  {
    dynamic: Options.boolean("dynamic").pipe(
      Options.withDescription(
        "Also replace users and subscriptions from local source data",
      ),
    ),
    reset: Options.boolean("reset").pipe(
      Options.withDescription(
        "Delete all Redis topic keys before writing local topics (requires interactive confirmation)",
      ),
    ),
  },
  (opts) =>
    Effect.gen(function* () {
      const redisClientLayer = RedisClientIoredis.layerConfig(
        RedisClientIoredisConfig,
      );
      const keyValueStoreLayer = KeyValueStoreRedis.layerConfig(
        RedisKeyValueStoreConfig,
      ).pipe(Layer.provide(redisClientLayer));
      const ProgramLayer = Layer.mergeAll(
        keyValueStoreLayer,
        redisClientLayer,
      ).pipe(
        Layer.provide(DotEnvConfigProvider),
        Layer.provideMerge(NodeContext.layer),
      );

      return yield* migrate({
        dynamic: opts.dynamic,
        reset: opts.reset,
      }).pipe(Effect.provide(ProgramLayer));
    }),
);

const Migrate = Command.run(MigrateCommand, {
  name: "jobs:migrate",
  version: "0.0.0",
});

const normalizeCliArgv = (argv: readonly string[]) => {
  if (argv.length > 2 && argv[2] === "--") {
    return [...argv.slice(0, 2), ...argv.slice(3)];
  }

  return [...argv];
};

function main() {
  Migrate(normalizeCliArgv(process.argv)).pipe(
    Effect.provide(NodeContext.layer),
    NodeRuntime.runMain,
  );
}

if (import.meta.main) {
  main();
}

export default main;
