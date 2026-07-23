import { Match } from "effect";

const domain = "dotheyplay.today";

const getSubdomainPrefix = (stage: string) =>
  stage === "production" ? "" : `${stage.toLowerCase().replaceAll("_", "-")}.`;

export const getServiceDomain = (service: "api" | "jobs", stage: string) =>
  Match.value(service).pipe(
    Match.when("api", () => `${getSubdomainPrefix(stage)}api.${domain}`),
    Match.when("jobs", () => `${getSubdomainPrefix(stage)}jobs.${domain}`),
    Match.exhaustive,
  );
