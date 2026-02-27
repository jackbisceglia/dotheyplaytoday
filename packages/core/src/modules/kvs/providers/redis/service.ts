import { KeyValueStore } from "@effect/platform";
import * as PlatformError from "@effect/platform/Error";
import { Config, Effect, Layer, Option } from "effect";

import { RedisClient } from "./client.js";
import { RedisKeyValueStoreConfig } from "./config.js";

const defaultPrefix = "dtpt";

const makeSystemError = (args: {
  method: string;
  pathOrDescriptor: string;
  cause: unknown;
}) =>
  new PlatformError.SystemError({
    reason: "Unknown",
    module: "KeyValueStore",
    method: args.method,
    pathOrDescriptor: args.pathOrDescriptor,
    description:
      args.cause instanceof Error
        ? args.cause.message
        : `Unknown Redis error: ${String(args.cause)}`,
    cause: args.cause,
  });

const scanPrefixedKeys = Effect.fn("KeyValueStoreRedis.scanPrefixedKeys")(
  function* (args: { redis: typeof RedisClient.Service; pattern: string }) {
    const keys: string[] = [];
    let cursor = "0";

    do {
      const [nextCursor, scannedKeys] = yield* Effect.tryPromise({
        try: () =>
          args.redis.scan(cursor, "MATCH", args.pattern, "COUNT", "100"),
        catch: (cause) =>
          makeSystemError({
            method: "scan",
            pathOrDescriptor: args.pattern,
            cause,
          }),
      });

      keys.push(...scannedKeys);
      cursor = nextCursor;
    } while (cursor !== "0");

    return keys;
  },
);

export const KeyValueStoreRedis = {
  layer: (keyPrefix = defaultPrefix) =>
    Layer.effect(
      KeyValueStore.KeyValueStore,
      Effect.gen(function* () {
        const redis = yield* RedisClient;
        const prefixed = (key: string) =>
          [keyPrefix, key].filter((part) => part.length > 0).join(":");
        const scanKeys = () =>
          scanPrefixedKeys({ redis, pattern: prefixed("*") });

        return KeyValueStore.makeStringOnly({
          get: (key) =>
            Effect.tryPromise({
              try: () => redis.get(prefixed(key)),
              catch: (cause) =>
                makeSystemError({
                  method: "get",
                  pathOrDescriptor: key,
                  cause,
                }),
            }).pipe(Effect.map(Option.fromNullable)),

          set: (key, value) =>
            Effect.tryPromise({
              try: () => redis.set(prefixed(key), value),
              catch: (cause) =>
                makeSystemError({
                  method: "set",
                  pathOrDescriptor: key,
                  cause,
                }),
            }).pipe(Effect.asVoid),

          remove: (key) =>
            Effect.tryPromise({
              try: () => redis.del(prefixed(key)),
              catch: (cause) =>
                makeSystemError({
                  method: "remove",
                  pathOrDescriptor: key,
                  cause,
                }),
            }).pipe(Effect.asVoid),

          clear: scanKeys().pipe(
            Effect.flatMap((keys) =>
              keys.length === 0
                ? Effect.void
                : Effect.tryPromise({
                    try: () => redis.del(...keys),
                    catch: (cause) =>
                      makeSystemError({
                        method: "clear",
                        pathOrDescriptor: prefixed("*"),
                        cause,
                      }),
                  }).pipe(Effect.asVoid),
            ),
          ),

          size: scanKeys().pipe(Effect.map((keys) => keys.length)),
        });
      }),
    ),

  layerConfig: (config: typeof RedisKeyValueStoreConfig) =>
    Layer.unwrapEffect(
      Config.unwrap(config).pipe(
        Effect.map((resolved) => KeyValueStoreRedis.layer(resolved.keyPrefix)),
      ),
    ),
};
