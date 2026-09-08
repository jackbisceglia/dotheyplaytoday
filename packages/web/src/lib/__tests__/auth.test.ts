import { expect, it, vi } from "vitest";

it("uses API-origin credentials for session lookup and standalone magic-link requests", async () => {
  vi.stubEnv("VITE_API_URL_BASE", "https://api.example.com");
  vi.stubEnv("VITE_API_URL_PORT", undefined);
  // Read Vite configuration after stubbing it, just as in the typed-client suite.
  vi.resetModules();
  const fetch = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValueOnce(Response.json(null))
    .mockResolvedValueOnce(Response.json({ status: true }));
  vi.stubGlobal("fetch", fetch);
  const { auth } = await import("../auth.js");
  const runtime = await import("../platform.js");
  try {
    expect((await auth.getSession()).data).toBeNull();
    expect(
      (await auth.signIn.magicLink({ email: "user@example.com" })).error,
    ).toBeNull();
    expect(
      fetch.mock.calls.map(([url, init]) => [
        url instanceof Request ? url.url : String(url),
        init?.credentials,
      ]),
    ).toEqual([
      ["https://api.example.com/api/auth/get-session", "include"],
      ["https://api.example.com/api/auth/sign-in/magic-link", "include"],
    ]);
    const body = fetch.mock.calls[1]?.[1]?.body;
    if (typeof body !== "string") throw new Error("Missing sign-in body");
    expect(JSON.parse(body)).toEqual({ email: "user@example.com" });
  } finally {
    await runtime.RuntimeClient.dispose();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  }
});
