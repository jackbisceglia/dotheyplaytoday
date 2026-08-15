import { Option } from "effect";

export const buildServiceUrl = (
  baseUrl: string,
  port: Option.Option<number>,
) => {
  const url = new URL(baseUrl);

  return Option.match(port, {
    onNone: () => url.origin,
    onSome: (value) => {
      url.port = value.toString();
      return url.origin;
    },
  });
};
