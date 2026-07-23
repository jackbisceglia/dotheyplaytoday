import { Match } from "effect";

import { StringParts } from "../string.js";

const domain = "dotheyplay.today";

const getSubdomainPrefix = (stage: string) =>
  stage === "production" ? "" : stage.toLowerCase().replaceAll("_", "-");

type Service = "api" | "jobs";

export const getServiceDomain = (service: Service, stage: string) => {
  const subdomainPrefix = getSubdomainPrefix(stage);

  return Match.value(service).pipe(
    Match.when("api", () =>
      StringParts()
        .addIf(subdomainPrefix.length > 0, subdomainPrefix)
        .addParts("api", domain)
        .make("."),
    ),
    Match.when("jobs", () =>
      StringParts()
        .addIf(subdomainPrefix.length > 0, subdomainPrefix)
        .addParts("jobs", domain)
        .make("."),
    ),
    Match.exhaustive,
  );
};
