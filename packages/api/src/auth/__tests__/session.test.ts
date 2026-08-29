import { describe, expect, it } from "vitest";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { Effect } from "effect";

import type { Auth } from "../auth.js";
import { getSession } from "../session.js";

describe("server session lookup", () => {
  it("resolves the user created with a persistent session cookie", async () => {
    const auth = betterAuth({
      baseURL: "https://api.example.com",
      secret: "test-secret-that-is-at-least-thirty-two-characters",
      database: memoryAdapter({
        user: [],
        session: [],
        account: [],
        verification: [],
      }),
      emailAndPassword: { enabled: true },
    });
    const signUp = await auth.api.signUpEmail({
      body: {
        name: "Test User",
        email: "user@example.com",
        password: "test-password-123",
      },
      asResponse: true,
    });
    const setCookie = signUp.headers.get("set-cookie");
    if (setCookie === null) throw new Error("Missing session cookie");
    const [cookie] = setCookie.split(";", 1);
    if (cookie === undefined) throw new Error("Missing session cookie value");
    const headers = new Headers({ cookie });

    const result = await Effect.runPromise(
      getSession(auth as unknown as Auth, headers),
    );

    expect(result?.user.email).toBe("user@example.com");
    expect(result?.session.token).toBeTruthy();
  });
});
