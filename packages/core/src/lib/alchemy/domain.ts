import { StringParts } from "../string.js";

const domain = "dotheyplay.today";

const getSubdomainPrefix = (stage: string) =>
  stage === "production" ? undefined : stage.toLowerCase().replaceAll("_", "-");

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
