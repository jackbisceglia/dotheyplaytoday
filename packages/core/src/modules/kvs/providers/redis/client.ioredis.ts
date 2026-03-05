import { Config, Effect, Layer, Redacted, Schema } from "effect";
import { Redis } from "ioredis";

import { RedisClient } from "./client.js";
import { RedisClientIoredisConfig } from "./config.js";

export class RedisClientIoredisInstantiationError extends Schema.TaggedError<RedisClientIoredisInstantiationError>()(
  "RedisClientIoredisInstantiationError",
  { cause: Schema.Defect },
) {}

const makeRedisClient = (url: string) =>
  Effect.acquireRelease(
    Effect.try({
      try: () => new Redis(url),
      catch: (cause) => RedisClientIoredisInstantiationError.make({ cause }),
    }),
    (client) => Effect.promise(() => client.quit()).pipe(Effect.asVoid),
  );

export const RedisClientIoredis = {
  layer: (url: string) => Layer.scoped(RedisClient, makeRedisClient(url)),

  layerConfig: (config: typeof RedisClientIoredisConfig) =>
    Layer.unwrapEffect(
      Config.unwrap(config).pipe(
        Effect.tap((resolved) =>
          Effect.logInfo(
            `kvs: redis client url='${Redacted.value(resolved.url)}'`,
          ),
        ),
        Effect.map((resolved) =>
          RedisClientIoredis.layer(Redacted.value(resolved.url)),
        ),
      ),
    ),
};
