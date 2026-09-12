import { describe, expect, it } from "vitest";
import { makeAuthFixture } from "./fixtures.js";

describe("server session lookup", () => {
  it("claims the existing notification user, persists a session, and consumes the token once", async () => {
    const { auth, makeAuth, rows, sendConfirmationLink, request } =
      await makeAuthFixture();
    const beforeIssuance = Date.now();
    const response = await auth.client.handler(
      request("/sign-in/magic-link", {
        email: "User@Example.COM",
      }),
    );
    expect(response.status).toBe(200);
    const url = sendConfirmationLink.mock.calls[0]?.[1];
    if (!url) throw new Error("Missing magic link");
    const token = new URL(url).searchParams.get("token");
    expect(token).toBeTruthy();
    expect(new URL(url).searchParams.get("callbackURL")).toBe(
      "https://www.example.com/home?confirmed=1",
    );
    expect(new URL(url).searchParams.get("errorCallbackURL")).toBe(
      "https://www.example.com/",
    );
    const expiry = (await rows("auth_verifications"))[0]?.expires_at;
    if (!(expiry instanceof Date))
      throw new Error("Missing verification expiry");
    expect(expiry.getTime()).toBeGreaterThanOrEqual(
      beforeIssuance + 15 * 60 * 1000,
    );
    expect(expiry.getTime()).toBeLessThanOrEqual(Date.now() + 15 * 60 * 1000);
    expect(await rows("auth_verifications")).toHaveLength(1);
    expect((await rows("auth_verifications"))[0]?.identifier).not.toBe(token);

    const verified = await auth.client.handler(new Request(url));
    expect(verified.status).toBe(302);
    expect(verified.headers.get("location")).toBe(
      "https://www.example.com/home?confirmed=1",
    );
    const setCookie = verified.headers.get("set-cookie");
    expect(setCookie).toContain("Secure");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");
    expect(setCookie).not.toContain("Domain=");
    const cookie = setCookie?.split(";", 1)[0];
    if (!cookie) throw new Error("Missing session cookie");
    const headers = new Headers({ cookie });
    const session = await (await makeAuth()).client.api.getSession({ headers });
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

    const replay = await auth.client.handler(new Request(url));
    expect(replay.headers.get("location")).toBe(
      "https://www.example.com/?error=INVALID_TOKEN",
    );
    expect(await rows("auth_sessions")).toHaveLength(1);

    await auth.client.api.signOut({ headers });
    expect(
      await (await makeAuth()).client.api.getSession({ headers }),
    ).toBeNull();
    expect(await rows("auth_sessions")).toHaveLength(0);
  });

  it("does not recreate a notification user removed after requesting a link", async () => {
    const { auth, database, rows, sendConfirmationLink, request } =
      await makeAuthFixture();
    await auth.client.handler(
      request("/sign-in/magic-link", { email: "user@example.com" }),
    );
    const url = sendConfirmationLink.mock.calls[0]?.[1];
    if (!url) throw new Error("Missing magic link");
    await database.exec("DELETE FROM users");

    const response = await auth.client.handler(new Request(url));
    expect(response.headers.get("location")).toContain(
      "error=new_user_signup_disabled",
    );
    expect(await rows("users")).toHaveLength(0);
    expect(await rows("auth_sessions")).toHaveLength(0);
  });

  it("rejects expired magic links", async () => {
    const { auth, database, rows, sendConfirmationLink, request } =
      await makeAuthFixture();
    await auth.client.handler(
      request("/sign-in/magic-link", { email: "user@example.com" }),
    );
    const url = sendConfirmationLink.mock.calls[0]?.[1];
    if (!url) throw new Error("Missing magic link");
    await database.exec(
      "UPDATE auth_verifications SET expires_at = '2000-01-01'",
    );

    const response = await auth.client.handler(new Request(url));
    expect(response.headers.get("location")).toContain("error=INVALID_TOKEN");
    expect(
      new URL(response.headers.get("location") ?? "").searchParams.has(
        "confirmed",
      ),
    ).toBe(false);
    expect(await rows("auth_sessions")).toHaveLength(0);
  });

  it("returns no session for absent or invalid cookies", async () => {
    const { auth } = await makeAuthFixture();
    expect(
      await auth.client.api.getSession({ headers: new Headers() }),
    ).toBeNull();
    expect(
      await auth.client.api.getSession({
        headers: new Headers({
          cookie: "__Secure-better-auth.session_token=invalid",
        }),
      }),
    ).toBeNull();
  });
});
