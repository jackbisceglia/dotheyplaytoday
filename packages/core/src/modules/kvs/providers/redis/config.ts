import { Config } from "effect";

export const RedisClientIoredisConfig = Config.all({
  url: Config.redacted("REDIS_URL"),
});

export const RedisKeyValueStoreConfig = Config.all({
  keyPrefix: Config.string("REDIS_KEY_PREFIX").pipe(Config.withDefault("dtpt")),
});
