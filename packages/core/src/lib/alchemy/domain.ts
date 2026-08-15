import {
  Function,
  Schema,
  SchemaTransformation,
  String as EffectString,
} from "effect";

import { isDevStage } from "./stage.js";
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

type Service = "api" | "jobs" | "web";

export const getServiceDomain = (service: Service, stage: string) =>
  StringParts()
    .addIf(stage !== "production", decodeSubdomainLabel(stage))
    .addIf(service !== "web", service)
    .add(domain)
    .make(".");

export const getManagedServiceDomain = (service: Service, stage: string) =>
  isDevStage(stage) ? undefined : getServiceDomain(service, stage);

export const url = (domain: string, protocol: "http" | "https" = "https") =>
  `${protocol}://${domain}`;
