import { afterAll, expect, it, vi } from "vitest";
import { authenticatedDestination, consumeConfirmation } from "../auth.js";
import { RuntimeClient } from "../platform.js";

afterAll(() => RuntimeClient.dispose());

it.each([
  ["", "/home"],
  ["?confirmed=1", "/home?confirmed=1"],
  ["?confirmed=0", "/home"],
  ["?confirmed=1&error=INVALID_TOKEN", "/home?error=1"],
])(
  "preserves only confirmation success on the authenticated redirect: %s",
  (search, destination) => {
    expect(authenticatedDestination(search)).toBe(destination);
  },
);

it("consumes confirmation once, replacing history and preserving other URL state", () => {
  let url = new URL(
    "https://www.example.com/home?confirmed=1&keep=yes#updates",
  );
  const state = { router: "state" };
  const history = {
    state,
    replaceState: vi.fn(
      (_state: unknown, _unused: string, next?: string | URL | null) => {
        url = new URL(String(next), url);
      },
    ),
  };
  expect(consumeConfirmation(url, { emailVerified: true }, history)).toBe(true);
  expect(history.replaceState).toHaveBeenCalledExactlyOnceWith(
    state,
    "",
    "/home?keep=yes#updates",
  );
  expect(consumeConfirmation(url, { emailVerified: true }, history)).toBe(
    false,
  );
  expect(history.replaceState).toHaveBeenCalledTimes(1);
});

it.each([
  ["?confirmed=1", false],
  ["?confirmed=1&error=INVALID_TOKEN", true],
  ["?confirmed=0", true],
])(
  "never substitutes the marker for verified session state: %s, verified %s",
  (search, emailVerified) => {
    const history = { state: null, replaceState: vi.fn() };
    expect(
      consumeConfirmation(
        new URL(`https://www.example.com/home${search}`),
        { emailVerified },
        history,
      ),
    ).toBe(false);
  },
);

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
  const { getAuthClient } = await import("../auth.js");
  const runtime = await import("../platform.js");
  try {
    const client = await getAuthClient();
    expect((await client.getSession()).data).toBeNull();
    expect(
      (await client.signIn.magicLink({ email: "user@example.com" })).error,
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
