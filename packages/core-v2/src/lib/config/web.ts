import { Config } from "effect";

export type WebConfig = Config.Success<typeof WebConfig>;
export const WebConfig = Config.all({
  publicBaseUrl: Config.string("PUBLIC_WEB_URL").pipe(
    Config.withDefault("http://localhost:3000"),
  ),
});
