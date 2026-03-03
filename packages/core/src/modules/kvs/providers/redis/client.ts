import { Context } from "effect";
import type { Redis } from "ioredis";

export class RedisClient extends Context.Tag(
  "@dtpt/kvs/providers/redis/RedisClient",
)<RedisClient, Pick<Redis, "get" | "set" | "del" | "scan">>() {}
