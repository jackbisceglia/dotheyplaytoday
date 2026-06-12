import { Match, Option } from "effect";

const toLocalHost = (port: number) => `http://localhost:${port.toString()}`;

export const buildServiceUrl = (
  url: Option.Option<string>,
  port: Option.Option<number>,
) =>
  Match.value({ url, port }).pipe(
    Match.when({ url: Option.isSome }, function (config) {
      return config.url;
    }),
    Match.when({ port: Option.isSome }, function (config) {
      return Option.map(config.port, toLocalHost);
    }),
    Match.orElse(() => Option.none()),
  );
