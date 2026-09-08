import { afterEach, expect, it, vi } from "vitest";

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }));
vi.mock("../auth.js", () => ({ auth: { getSession } }));
vi.mock("@solidjs/router", () => ({ query: (fn: unknown) => fn }));

const { getUser } = await import("../session.js");

afterEach(() => getSession.mockReset());

it("returns an anonymous session without imposing a route redirect", async () => {
  getSession.mockResolvedValue({ data: null, error: null });
  expect(await getUser()).toBeNull();
  expect(getSession).toHaveBeenCalledExactlyOnceWith();
});

it.each([true, false])(
  "returns the session user with emailVerified=%s",
  async (emailVerified) => {
    const user = { email: "user@example.com", emailVerified };
    getSession.mockResolvedValue({ data: { user }, error: null });
    expect(await getUser()).toBe(user);
  },
);

it("keeps session lookup failures distinct from signed-out sessions", async () => {
  getSession.mockResolvedValue({
    data: null,
    error: { message: "Unavailable" },
  });
  await expect(getUser()).rejects.toThrow("Unavailable");
});
