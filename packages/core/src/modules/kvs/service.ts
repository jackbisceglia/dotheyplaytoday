import { FileSystem, KeyValueStore, Path } from "@effect/platform";
import { RedisClientIoredis } from "./providers/redis/client.ioredis.js";
import {
  RedisClientIoredisConfig,
  RedisKeyValueStoreConfig,
} from "./providers/redis/config.js";
import { KeyValueStoreRedis } from "./providers/redis/service.js";
import { Effect, Layer, Match, Schema } from "effect";

export type KvsOption = typeof KvsOption.Type;
export const KvsOption = Schema.Literal("fs", "redis");

type KvsLayer = Layer.Layer<
  KeyValueStore.KeyValueStore,
  unknown,
  FileSystem.FileSystem | Path.Path
>;

export const getKvsByRuntime = (runtime: string | undefined): KvsOption =>
  Match.value(runtime).pipe(
    Match.whenOr("production", "prod", () => "redis" as const),
    Match.orElse(() => "fs" as const),
  );

export const getKvsSelection = (
  runtime: string | undefined,
  override?: KvsOption,
): KvsOption => override ?? getKvsByRuntime(runtime);

export const makeRedisKvsLayer = () =>
  KeyValueStoreRedis.layerConfig(RedisKeyValueStoreConfig).pipe(
    Layer.provide(RedisClientIoredis.layerConfig(RedisClientIoredisConfig)),
  );

export const makeFileSystemKvsLayer = Effect.fn("makeFileSystemKvsLayer")(
  function* (...segments: readonly string[]) {
    const path = yield* Path.Path;

    return KeyValueStore.layerFileSystem(path.join(...segments));
  },
);

export const makeKvsLayer = (
  selection: KvsOption,
  ...segments: readonly string[]
): KvsLayer =>
  Match.value(selection).pipe(
    Match.when("redis", () => makeRedisKvsLayer()),
    Match.when("fs", () =>
      Layer.unwrapEffect(makeFileSystemKvsLayer(...segments)),
    ),
    Match.exhaustive,
  );
