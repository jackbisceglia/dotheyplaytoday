import { StringParts } from "../string.js";

const domain = "dotheyplay.today";

const getSubdomainPrefix = (stage: string) =>
  stage === "production" ? undefined : stage.toLowerCase().replaceAll("_", "-");

type Service = "api" | "jobs" | "web";

export const getServiceDomain = (service: Service, stage: string) => {
  const isWeb = service === "web";

  // The Vite job will not have a domain in dev; deployed web uses the root domain.
  return StringParts()
    .addNullable(isWeb ? undefined : getSubdomainPrefix(stage))
    .addNullable(isWeb ? undefined : service)
    .add(domain)
    .make(".");
};
