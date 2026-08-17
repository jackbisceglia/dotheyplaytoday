import { Option } from "effect";

const withPort = (value: string, port: number) => {
  const url = new URL(value);

  url.port = port.toString();
  return url;
};

export const buildServiceUrl = (
  baseUrl: string,
  port: Option.Option<number>,
) =>
  Option.match(port, {
    onNone: () => new URL(baseUrl).origin,
    onSome: (value) => withPort(baseUrl, value).origin,
  });
