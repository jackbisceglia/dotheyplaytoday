import type { RoutePreloadFunc } from "@solidjs/router";
import { afterEach, expect, it, vi } from "vitest";

const { getSession, createRouter } = vi.hoisted(() => ({
  getSession: vi.fn(),
  createRouter: vi.fn(
    (_options: { routes: { path: string; preload?: RoutePreloadFunc }[] }) => ({
      paths: () => "/",
    }),
  ),
}));

vi.mock("../lib/auth.js", () => ({ auth: { getSession } }));
vi.mock("../lib/api.js", () => ({ withApiClient: () => Promise.resolve([]) }));
vi.mock("@solidjs/router", async (original) => ({
  ...(await original<typeof import("@solidjs/router")>()),
  createRouter,
  query: (fn: unknown) => fn,
}));

await import("../App.jsx");
const options = createRouter.mock.calls[0]?.[0];

function preload(pathname: string, search = "") {
  const route = options?.routes.find((route) => route.path === pathname);
  return route?.preload?.({
    location: {
      pathname,
      search,
      hash: "",
      state: null,
      key: "test",
      query: {},
    },
    params: {},
    intent: "initial",
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
  getSession.mockReset();
});

it.each(["", "?confirmed=1", "?confirmed=1&error=INVALID_TOKEN"])(
  "redirects signed-in visitors at the route boundary, preserving %s",
  async (search) => {
    vi.stubEnv("SSR", false);
    getSession.mockResolvedValue({
      data: { user: { emailVerified: true } },
      error: null,
    });
    await expect(preload("/", search)).resolves.toSatisfy(
      (response: Response) =>
        response.status === 302 &&
        response.headers.get("Location") === `/home${search}`,
    );
  },
);

it("does not grant access from the confirmation marker", async () => {
  vi.stubEnv("SSR", false);
  getSession.mockResolvedValue({ data: null, error: null });
  await expect(preload("/home", "?confirmed=1")).resolves.toSatisfy(
    (response: Response) => response.headers.get("Location") === "/sign-in",
  );
  await expect(preload("/")).resolves.toBeUndefined();
});

it("loads the authenticated user from the session", async () => {
  vi.stubEnv("SSR", false);
  const user = { email: "user@example.com", emailVerified: false };
  getSession.mockResolvedValue({ data: { user }, error: null });
  await expect(preload("/home", "?confirmed=1")).resolves.toBe(user);
});

it("does not read the API's host-only session cookie during Web SSR", () => {
  vi.stubEnv("SSR", true);
  expect(preload("/")).toBeUndefined();
  expect(preload("/home")).toBeUndefined();
  expect(getSession).not.toHaveBeenCalled();
});

it("reports session lookup failures without admitting the visitor", async () => {
  vi.stubEnv("SSR", false);
  getSession.mockResolvedValue({
    data: null,
    error: { message: "Unavailable" },
  });
  await expect(preload("/home", "?confirmed=1")).rejects.toThrow("Unavailable");
});
