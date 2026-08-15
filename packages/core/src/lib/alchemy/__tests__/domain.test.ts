import { describe, expect, it } from "vitest";

import { getManagedServiceDomain, getServiceDomain, url } from "../domain.js";

describe("service domains", () => {
  it("uses stable production domains", () => {
    expect(getServiceDomain("web", "production")).toBe("dotheyplay.today");
    expect(getServiceDomain("api", "production")).toBe("api.dotheyplay.today");
    expect(getServiceDomain("jobs", "production")).toBe(
      "jobs.dotheyplay.today",
    );
    expect(getManagedServiceDomain("api", "production")).toBe(
      "api.dotheyplay.today",
    );
  });

  it("prefixes managed non-development domains with the stage", () => {
    expect(getManagedServiceDomain("web", "staging")).toBe(
      "staging.dotheyplay.today",
    );
    expect(getManagedServiceDomain("api", "preview_123")).toBe(
      "preview-123.api.dotheyplay.today",
    );
    expect(getManagedServiceDomain("jobs", "QA_")).toBe(
      "qa.jobs.dotheyplay.today",
    );
  });

  it("leaves development stages on development-only URLs", () => {
    expect(getManagedServiceDomain("api", "dev_jack")).toBeUndefined();
    expect(getManagedServiceDomain("web", "dev_jack")).toBeUndefined();
  });

  it("rejects stage prefixes outside the subdomain label length limit", () => {
    expect(() => getServiceDomain("api", "a".repeat(64))).toThrow();
    expect(() => getServiceDomain("jobs", "---")).toThrow();
  });

  it("builds secure deployed and local service URLs", () => {
    expect(url("dotheyplay.today")).toBe("https://dotheyplay.today");
    expect(url("localhost", "http")).toBe("http://localhost");
  });
});
