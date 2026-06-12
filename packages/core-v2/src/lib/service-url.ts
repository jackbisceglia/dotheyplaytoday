import { Option } from "effect";

export const buildServiceUrl = (input: {
  readonly port: Option.Option<number>;
  readonly url: Option.Option<string>;
}) =>
  Option.orElse(
    input.url,
    () =>
      Option.map(input.port, (port) => `http://localhost:${port.toString()}`),
  );
