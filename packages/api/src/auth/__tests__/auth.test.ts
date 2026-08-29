import { describe, expect, it, vi } from "vitest";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { magicLink } from "better-auth/plugins";

import { authModelNames, makeMagicLinkSender } from "../auth.js";
import { authDatabaseSchema } from "../database.js";

describe("Better Auth configuration boundaries", () => {
  it("maps every Better Auth model to the explicit application table", () => {
    expect(Object.keys(authDatabaseSchema)).toEqual(
      Object.values(authModelNames),
    );
    expect(authDatabaseSchema.users).toBeDefined();
    expect(authDatabaseSchema.authSessions).toBeDefined();
    expect(authDatabaseSchema.authAccounts).toBeDefined();
    expect(authDatabaseSchema.authVerifications).toBeDefined();
  });

  it("normalizes and defers delivery for an existing user", async () => {
    const deliver = vi.fn(() => Promise.resolve());
    const deferred: Promise<unknown>[] = [];
    const sender = makeMagicLinkSender({
      userExists: (email) => Promise.resolve(email === "user@example.com"),
      deliver,
      defer: (promise) => deferred.push(promise),
    });

    await sender({
      email: " User@Example.COM ",
      url: "https://example.com/link",
    });
    await Promise.all(deferred);

    expect(deliver).toHaveBeenCalledWith(
      "user@example.com",
      "https://example.com/link",
    );
  });

  it("does not deliver or defer work for an unknown user", async () => {
    const deliver = vi.fn(() => Promise.resolve());
    const defer = vi.fn();
    const sender = makeMagicLinkSender({
      userExists: () => Promise.resolve(false),
      deliver,
      defer,
    });

    await sender({
      email: "unknown@example.com",
      url: "https://example.com/link",
    });

    expect(deliver).not.toHaveBeenCalled();
    expect(defer).not.toHaveBeenCalled();
  });

  it("returns the ordinary success response for an unknown email", async () => {
    const deliver = vi.fn(() => Promise.resolve());
    const sender = makeMagicLinkSender({
      userExists: () => Promise.resolve(false),
      deliver,
      defer: vi.fn(),
    });
    const auth = betterAuth({
      baseURL: "https://api.example.com",
      secret: "test-secret-that-is-at-least-thirty-two-characters",
      database: memoryAdapter({}),
      plugins: [magicLink({ disableSignUp: true, sendMagicLink: sender })],
    });

    const response = await auth.handler(
      new Request("https://api.example.com/api/auth/sign-in/magic-link", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://api.example.com",
        },
        body: JSON.stringify({ email: "unknown@example.com" }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: true });
    expect(deliver).not.toHaveBeenCalled();
  });
});
