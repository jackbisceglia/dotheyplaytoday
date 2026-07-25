import { describe, expect, it } from "vitest";

import { getServiceDomain, url } from "../domain.js";

describe("service domains", () => {
  it("uses stable production domains", () => {
    expect(getServiceDomain("web", "production")).toBe("dotheyplay.today");
    expect(getServiceDomain("api", "production")).toBe("api.dotheyplay.today");
    expect(getServiceDomain("jobs", "production")).toBe(
      "jobs.dotheyplay.today",
    );
  });

  it("prefixes worker domains with a DNS-safe development stage", () => {
    expect(getServiceDomain("api", "dev_jack")).toBe(
      "dev-jack.api.dotheyplay.today",
    );
    expect(getServiceDomain("jobs", "QA_")).toBe("qa.jobs.dotheyplay.today");
  });

  it("rejects stage prefixes outside the DNS label length limit", () => {
    expect(() => getServiceDomain("api", "a".repeat(64))).toThrow();
    expect(() => getServiceDomain("jobs", "---")).toThrow();
  });

  it("keeps the web app on the root domain outside local Vite development", () => {
    expect(getServiceDomain("web", "staging")).toBe("dotheyplay.today");
  });

  it("builds secure deployed and local service URLs", () => {
    expect(url("dotheyplay.today")).toBe("https://dotheyplay.today");
    expect(url("localhost", "http")).toBe("http://localhost");
  });
});
