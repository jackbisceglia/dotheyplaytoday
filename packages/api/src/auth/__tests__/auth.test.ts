import { makeAuthFixture } from "./fixtures.js";
import { describe, expect, it, vi } from "vitest";
import { Effect } from "effect";
import { EmailResponseError } from "@dtpt/core/modules/email/errors";
import { WebUrl } from "@dtpt/core/lib/config/web";

describe("authentication boundaries", () => {
  it.each([false, true])(
    "returns identical known/unknown responses and selects the stored verification state (verified: %s)",
    async (verified) => {
      const {
        auth,
        database,
        rows,
        sendConfirmationLink,
        sendSignInLink,
        request,
        pending,
      } = await makeAuthFixture();
      await database.query("UPDATE users SET email_verified = $1", [verified]);
      for (const email of ["User@Example.COM", "unknown@example.com"]) {
        const response = await auth.client.handler(
          request("/sign-in/magic-link", {
            email,
            callbackURL: "https://www.example.com/ignored?confirmed=1",
            errorCallbackURL: "https://www.example.com/ignored?confirmed=1",
          }),
        );
        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({ status: true });
      }
      await Promise.all(pending);
      expect(sendConfirmationLink).toHaveBeenCalledTimes(verified ? 0 : 1);
      expect(sendSignInLink).toHaveBeenCalledTimes(verified ? 1 : 0);
      const sender = verified ? sendSignInLink : sendConfirmationLink;
      expect(sender.mock.calls[0]?.[0]).toBe("user@example.com");
      expect(sender.mock.calls[0]?.[1]).toContain(
        "https://api.example.com/api/auth/magic-link/verify?token=",
      );
      const link = sender.mock.calls[0]?.[1];
      if (!link) throw new Error("Missing magic link");
      expect(new URL(link).searchParams.get("callbackURL")).toBe(
        verified
          ? "https://www.example.com/"
          : "https://www.example.com/?confirmed=1",
      );
      expect(new URL(link).searchParams.get("errorCallbackURL")).toBe(
        "https://www.example.com/",
      );
      const redeemed = await auth.client.handler(new Request(link));
      expect(redeemed.headers.get("location")).toBe(
        new URL(link).searchParams.get("callbackURL"),
      );
      expect(redeemed.headers.get("set-cookie")).toContain("session_token");
      expect(await rows("auth_sessions")).toHaveLength(1);
      expect((await rows("users"))[0]?.email_verified).toBe(true);
      expect(await rows("users")).toHaveLength(1);
    },
  );

  it("looks up each recipient once and isolates concurrent HTTP and server API issuances", async () => {
    const f = await makeAuthFixture();
    await f.database
      .exec(`INSERT INTO users (id, email, timezone, unsubscribe_token, email_verified)
      VALUES ('verified-user', 'verified@example.com', 'America/New_York', 'verified-token', true)`);
    const { internalAdapter } = await f.auth.client.$context;
    const lookup = vi.spyOn(internalAdapter, "findUserByEmail");
    const forgedRecipient = {
      email: "verified@example.com",
      emailVerified: true,
    };
    const [confirmation, signIn, unknown] = await Promise.all([
      f.auth.client.handler(
        f.request("/sign-in/magic-link", {
          email: "User@Example.COM",
          magicLinkRecipient: forgedRecipient,
          metadata: { magicLinkRecipient: forgedRecipient },
        }),
      ),
      f.auth.client.api.signInMagicLink({
        headers: f.request("/sign-in/magic-link").headers,
        body: { email: "verified@example.com" },
      }),
      f.auth.client.handler(
        f.request("/sign-in/magic-link", {
          email: "unknown@example.com",
          metadata: { magicLinkRecipient: forgedRecipient },
        }),
      ),
    ]);
    expect(confirmation.status).toBe(200);
    expect(signIn).toEqual({ status: true });
    expect(unknown.status).toBe(200);
    expect(lookup.mock.calls).toEqual(
      expect.arrayContaining([
        ["user@example.com"],
        ["verified@example.com"],
        ["unknown@example.com"],
      ]),
    );
    expect(lookup).toHaveBeenCalledTimes(3);
    await Promise.all(f.pending);
    expect(f.sendConfirmationLink).toHaveBeenCalledExactlyOnceWith(
      "user@example.com",
      expect.any(String),
    );
    expect(f.sendSignInLink).toHaveBeenCalledExactlyOnceWith(
      "verified@example.com",
      expect.any(String),
    );
    for (const [sender, callback] of [
      [f.sendConfirmationLink, "https://www.example.com/?confirmed=1"],
      [f.sendSignInLink, "https://www.example.com/"],
    ] as const) {
      const link = sender.mock.calls[0]?.[1];
      if (!link) throw new Error("Missing magic link");
      expect(new URL(link).searchParams.get("callbackURL")).toBe(callback);
      expect(new URL(link).searchParams.get("errorCallbackURL")).toBe(
        "https://www.example.com/",
      );
    }
  });

  it("uses the same verification snapshot for the callback and email copy", async () => {
    const f = await makeAuthFixture();
    const { internalAdapter } = await f.auth.client.$context;
    const findUser = internalAdapter.findUserByEmail.bind(internalAdapter);
    const lookup = vi
      .spyOn(internalAdapter, "findUserByEmail")
      .mockImplementationOnce(async (...args) => {
        const user = await findUser(...args);
        await f.database.exec("UPDATE users SET email_verified = true");
        return user;
      });
    const response = await f.auth.client.handler(
      f.request("/sign-in/magic-link", { email: "user@example.com" }),
    );
    expect(response.status).toBe(200);
    expect(lookup).toHaveBeenCalledTimes(1);
    await Promise.all(f.pending);
    expect(f.sendConfirmationLink).toHaveBeenCalledOnce();
    expect(f.sendSignInLink).not.toHaveBeenCalled();
    const link = f.sendConfirmationLink.mock.calls[0]?.[1];
    if (!link) throw new Error("Missing confirmation link");
    expect(new URL(link).searchParams.get("callbackURL")).toBe(
      "https://www.example.com/?confirmed=1",
    );
  });

  it("rejects untrusted request origins and callback URLs", async () => {
    const { auth, sendConfirmationLink, request } = await makeAuthFixture();
    const response = await auth.client.handler(
      request(
        "/sign-in/magic-link",
        {
          email: "user@example.com",
        },
        "https://untrusted.example",
      ),
    );
    expect(response.status).toBe(403);
    const callback = await auth.client.handler(
      request("/sign-in/magic-link", {
        email: "user@example.com",
        callbackURL: "https://untrusted.example/account",
      }),
    );
    expect(callback.status).toBe(403);
    expect(sendConfirmationLink).not.toHaveBeenCalled();
  });

  it("enforces magic-link rate limits across request-scoped auth instances", async () => {
    const { makeAuth, request } = await makeAuthFixture();
    for (let attempt = 0; attempt < 6; attempt++) {
      const response = await (
        await makeAuth()
      ).client.handler(
        request("/sign-in/magic-link", {
          email: "unknown@example.com",
        }),
      );
      expect(response.status).toBe(attempt < 5 ? 200 : 429);
    }
  });

  it("registers email delivery without delaying the response", async () => {
    const { auth, request, sendConfirmationLink, pending } =
      await makeAuthFixture();
    const delivery = Promise.withResolvers<undefined>();
    let webUrl: string | undefined;
    sendConfirmationLink.mockImplementationOnce(() =>
      Effect.gen(function* () {
        webUrl = yield* WebUrl;
        yield* Effect.promise(() => delivery.promise);
      }),
    );
    try {
      const response = await auth.client.handler(
        request("/sign-in/magic-link", { email: "user@example.com" }),
      );
      expect(response.status).toBe(200);
      expect(pending).toHaveLength(1);
      expect(webUrl).toBe("https://www.example.com");
    } finally {
      delivery.resolve(undefined);
      await Promise.all(pending);
    }
  });

  it("allows replacement after background delivery failure without changing the user", async () => {
    const f = await makeAuthFixture();
    const before = await f.rows("users");
    f.sendConfirmationLink.mockReturnValueOnce(
      Effect.fail(
        new EmailResponseError({
          message: "Rejected",
          code: "validation_error",
          statusCode: 422,
        }),
      ),
    );
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await f.auth.client.handler(
        f.request("/sign-in/magic-link", { email: "user@example.com" }),
      );
      expect(response.status).toBe(200);
      await Promise.all(f.pending);
    }
    expect(await f.rows("users")).toEqual(before);
    expect(f.sendConfirmationLink).toHaveBeenCalledTimes(2);
    const firstUrl = f.sendConfirmationLink.mock.calls[0]?.[1];
    const replacementUrl = f.sendConfirmationLink.mock.calls[1]?.[1];
    expect(replacementUrl).not.toBe(firstUrl);
    if (!replacementUrl) throw new Error("Missing replacement link");
    const redemption = await f.auth.client.handler(new Request(replacementUrl));
    expect(redemption.status).toBe(302);
    expect(await f.rows("auth_sessions")).toHaveLength(1);
  });

  it("keeps profile updates outside this foundation", async () => {
    const { auth, request } = await makeAuthFixture();
    const response = await auth.client.handler(
      request("/update-user", { image: "https://example.com/photo.png" }),
    );
    expect(response.status).toBe(404);
  });
});
