import { Match } from "effect";

const domain = "dotheyplay.today";

const stagePrefix = (stage: string) =>
  stage === "production" ? "" : `${stage.toLowerCase().replaceAll("_", "-")}.`;

export const getServiceDomain = (service: "api" | "jobs", stage: string) =>
  Match.value(service).pipe(
    Match.when("api", () => `${stagePrefix(stage)}api.${domain}`),
    Match.when("jobs", () => `${stagePrefix(stage)}jobs.${domain}`),
    Match.exhaustive,
  );
