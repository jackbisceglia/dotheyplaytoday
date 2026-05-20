import { Config } from "effect";

export const DatabaseConfig = Config.all({
  url: Config.string("DATABASE_URL"),
});
