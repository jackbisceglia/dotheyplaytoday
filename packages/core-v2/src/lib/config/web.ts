import { Config } from "effect";

export type WebConfig = Config.Success<typeof WebConfig>;
export const WebConfig = Config.all({
  port: Config.number("VITE_WEB_PORT").pipe(Config.withDefault(3000)),
  url: Config.string("VITE_WEB_URL").pipe(
    Config.withDefault("http://localhost"),
  ),
});
