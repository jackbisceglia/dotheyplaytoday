import { Config } from "effect";

export type WebConfig = Config.Success<typeof WebConfig>;
export const WebConfig = Config.all({
  port: Config.port("WEB_PORT"),
  url: Config.string("VITE_WEB_URL").pipe(Config.option),
});
