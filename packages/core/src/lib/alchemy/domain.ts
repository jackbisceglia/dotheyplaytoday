import { Match } from "effect";

import { StringParts } from "../string.js";

const domain = "dotheyplay.today";

const getSubdomainPrefix = (stage: string) =>
  stage === "production" ? undefined : stage.toLowerCase().replaceAll("_", "-");

type Service = "api" | "jobs" | "web";

export const getServiceDomain = (service: Service, stage: string) => {
  const subdomainPrefix = getSubdomainPrefix(stage);

  return Match.value(service).pipe(
    Match.when("api", () =>
      StringParts()
        .addNullable(subdomainPrefix)
        .add("api")
        .add(domain)
        .make("."),
    ),
    Match.when("jobs", () =>
      StringParts()
        .addNullable(subdomainPrefix)
        .add("jobs")
        .add(domain)
        .make("."),
    ),
    // The Vite job will not have a domain in dev; workers use localhost instead.
    Match.when("web", () => domain),
    Match.exhaustive,
  );
};
