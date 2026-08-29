import { describe, expect, it } from "vitest";

import { withCredentialedAuthCors } from "../handler.js";

describe("auth CORS", () => {
  it("allows the configured Web origin with credentials", () => {
    const request = new Request(
      "https://api.example.com/api/auth/get-session",
      {
        headers: { origin: "https://web.example.com" },
      },
    );
    const response = withCredentialedAuthCors(
      request,
      Response.json({ ok: true }),
      "https://web.example.com",
    );

    expect(response.headers.get("access-control-allow-origin")).toBe(
      "https://web.example.com",
    );
    expect(response.headers.get("access-control-allow-credentials")).toBe(
      "true",
    );
    expect(response.headers.get("vary")).toContain("Origin");
  });

  it("does not reflect an untrusted origin", () => {
    const request = new Request(
      "https://api.example.com/api/auth/get-session",
      {
        headers: { origin: "https://evil.example" },
      },
    );
    const response = withCredentialedAuthCors(
      request,
      Response.json({ ok: true }),
      "https://web.example.com",
    );

    expect(response.headers.has("access-control-allow-origin")).toBe(false);
  });
});
