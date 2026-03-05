import { FileSystem, KeyValueStore, Path } from "@effect/platform";
import { RedisClientIoredis } from "@dtpt/core/modules/kvs/providers/redis/client.ioredis";
import {
  RedisClientIoredisConfig,
  RedisKeyValueStoreConfig,
} from "@dtpt/core/modules/kvs/providers/redis/config";
import { KeyValueStoreRedis } from "@dtpt/core/modules/kvs/providers/redis/service";
import { Effect, Layer, Match } from "effect";

export type KvsSelection = "redis" | "fs";

type KvsLayer = Layer.Layer<
  KeyValueStore.KeyValueStore,
  unknown,
  Path.Path | FileSystem.FileSystem
>;

const layers: Record<KvsSelection, () => KvsLayer> = {
  redis: () =>
    KeyValueStoreRedis.layerConfig(RedisKeyValueStoreConfig).pipe(
      Layer.provide(RedisClientIoredis.layerConfig(RedisClientIoredisConfig)),
    ),
  fs: () =>
    Layer.unwrapEffect(
      Effect.gen(function* () {
        const path = yield* Path.Path;

        return KeyValueStore.layerFileSystem(
          path.join(
            import.meta.dirname,
            "..",
            "..",
            "..",
            "core",
            "data",
            "kv",
          ),
        );
      }),
    ),
};

export const getKvsLayer = (selection: KvsSelection) => layers[selection]();

export const selectKvsLayer = (
  env: string | undefined,
  kvsOverride?: KvsSelection,
) => {
  const selection: KvsSelection = Match.value<
    [string | undefined, KvsSelection | undefined]
  >([env, kvsOverride]).pipe(
    Match.when([Match.any, "fs"], () => "fs" as const),
    Match.whenOr(
      ["development", Match.any],
      ["dev", Match.any],
      () => "fs" as const,
    ),
    Match.whenOr(
      [Match.any, "redis"],
      ["production", Match.any],
      ["prod", Match.any],
      () => "redis" as const,
    ),
    Match.orElse(() => "fs" as const),
  );

  return {
    layer: getKvsLayer(selection),
    selection,
  };
};
