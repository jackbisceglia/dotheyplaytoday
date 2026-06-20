import { Option } from "effect";

export const buildServiceUrl = (
  baseUrl: string,
  port: Option.Option<number>,
) =>
  Option.match(port, {
    onNone: () => baseUrl,
    onSome: (value) => `${baseUrl}:${value.toString()}`,
  });
