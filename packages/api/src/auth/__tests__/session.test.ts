import { describe, expect, it } from "vitest";
import { makeAuthFixture } from "./fixtures.js";

describe("server session lookup", () => {
  it("claims the existing notification user, persists a session, and consumes the token once", async () => {
    const { auth, makeAuth, rows, sendMagicLink, request } =
      await makeAuthFixture();
    const response = await auth.handler(
      request("/sign-in/magic-link", { email: "User@Example.COM" }),
    );
    expect(response.status).toBe(200);
    const message = sendMagicLink.mock.calls[0]?.[0];
    if (!message) throw new Error("Missing magic link");
    const token = new URL(message.url).searchParams.get("token");
    expect(token).toBeTruthy();
    expect(await rows("auth_verifications")).toHaveLength(1);
    expect((await rows("auth_verifications"))[0]?.identifier).not.toBe(token);

    const verified = await auth.handler(new Request(message.url));
    expect(verified.status).toBe(302);
    const setCookie = verified.headers.get("set-cookie");
    expect(setCookie).toContain("Secure");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");
    expect(setCookie).not.toContain("Domain=");
    const cookie = setCookie?.split(";", 1)[0];
    if (!cookie) throw new Error("Missing session cookie");
    const headers = new Headers({ cookie });
    const session = await (await makeAuth()).api.getSession({ headers });
    expect(session?.user).toMatchObject({
      id: "existing-notification-user",
      email: "user@example.com",
      emailVerified: true,
      name: null,
    });
    expect(await rows("users")).toHaveLength(1);
    expect((await rows("users"))[0]).toMatchObject({
      name: null,
      timezone: "America/New_York",
      unsubscribe_token: "existing-unsubscribe-token",
    });
    expect(await rows("auth_sessions")).toHaveLength(1);
    expect(await rows("auth_verifications")).toHaveLength(0);

    const replay = await auth.handler(new Request(message.url));
    expect(replay.headers.get("location")).toContain("error=INVALID_TOKEN");
    expect(await rows("auth_sessions")).toHaveLength(1);

    await auth.api.signOut({ headers });
    expect(await (await makeAuth()).api.getSession({ headers })).toBeNull();
    expect(await rows("auth_sessions")).toHaveLength(0);
  });

  it("does not recreate a notification user removed after requesting a link", async () => {
    const { auth, database, rows, sendMagicLink, request } =
      await makeAuthFixture();
    await auth.handler(
      request("/sign-in/magic-link", { email: "user@example.com" }),
    );
    const message = sendMagicLink.mock.calls[0]?.[0];
    if (!message) throw new Error("Missing magic link");
    await database.exec("DELETE FROM users");

    const response = await auth.handler(new Request(message.url));
    expect(response.headers.get("location")).toContain(
      "error=new_user_signup_disabled",
    );
    expect(await rows("users")).toHaveLength(0);
    expect(await rows("auth_sessions")).toHaveLength(0);
  });

  it("rejects expired magic links", async () => {
    const { auth, database, rows, sendMagicLink, request } =
      await makeAuthFixture();
    await auth.handler(
      request("/sign-in/magic-link", { email: "user@example.com" }),
    );
    const message = sendMagicLink.mock.calls[0]?.[0];
    if (!message) throw new Error("Missing magic link");
    await database.exec(
      "UPDATE auth_verifications SET expires_at = '2000-01-01'",
    );

    const response = await auth.handler(new Request(message.url));
    expect(response.headers.get("location")).toContain("error=INVALID_TOKEN");
    expect(await rows("auth_sessions")).toHaveLength(0);
  });

  it("returns no session for absent or invalid cookies", async () => {
    const { auth } = await makeAuthFixture();
    expect(await auth.api.getSession({ headers: new Headers() })).toBeNull();
    expect(
      await auth.api.getSession({
        headers: new Headers({
          cookie: "__Secure-better-auth.session_token=invalid",
        }),
      }),
    ).toBeNull();
  });
});
