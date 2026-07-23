import { describe, expect, it } from "vitest";

import { getServiceDomain } from "../domain.js";

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
    expect(getServiceDomain("jobs", "dev_jack")).toBe(
      "dev-jack.jobs.dotheyplay.today",
    );
  });

  it("keeps the web app on the root domain outside local Vite development", () => {
    expect(getServiceDomain("web", "staging")).toBe("dotheyplay.today");
  });
});
