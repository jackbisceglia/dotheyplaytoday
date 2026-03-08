import { Match } from "effect";

export function buildUrl(url: string, port: number | undefined) {
  return Match.value(port).pipe(
    Match.when(undefined, () => url),
    Match.orElse((value) => `${url}:${value.toString()}`),
  );
}
