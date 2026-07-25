import {
  Function,
  Schema,
  SchemaTransformation,
  String as EffectString,
} from "effect";

import { StringParts } from "../string.js";

const domain = "dotheyplay.today";

const decodeSubdomainLabel = Schema.decodeUnknownSync(
  Schema.String.pipe(
    Schema.decode(
      SchemaTransformation.transform({
        decode: EffectString.kebabCase,
        encode: Function.identity,
      }),
    ),
    Schema.decodeTo(Schema.String.check(Schema.isLengthBetween(1, 63))),
  ),
);

const getSubdomainPrefix = (stage: string) =>
  stage === "production" ? undefined : decodeSubdomainLabel(stage);

type Service = "api" | "jobs" | "web";

export const getServiceDomain = (service: Service, stage: string) => {
  const subdomainPrefix =
    service === "web" ? undefined : getSubdomainPrefix(stage);

  return StringParts()
    .addNullable(subdomainPrefix)
    .addIf(service !== "web", service)
    .add(domain)
    .make(".");
};

export const url = (domain: string, protocol: "http" | "https" = "https") =>
  `${protocol}://${domain}`;
