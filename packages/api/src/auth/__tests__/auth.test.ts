import { makeAuthFixture } from "./fixtures.js";
import { describe, expect, it } from "vitest";
import { Effect } from "effect";
import { WebUrl } from "@dtpt/core/lib/config/web";

describe("authentication boundaries", () => {
  it("returns identical success for existing and unknown emails, sending only to the existing user", async () => {
    const { auth, rows, sendMagicLink, request, pending } =
      await makeAuthFixture();
    for (const email of ["User@Example.COM", "unknown@example.com"]) {
      const response = await auth.client.handler(
        request("/sign-in/magic-link", { email }),
      );
      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ status: true });
    }
    await Promise.all(pending);
    expect(sendMagicLink).toHaveBeenCalledOnce();
    expect(sendMagicLink.mock.calls[0]?.[0].recipient).toBe("user@example.com");
    expect(sendMagicLink.mock.calls[0]?.[0].url).toContain(
      "https://api.example.com/api/auth/magic-link/verify?token=",
    );
    expect(await rows("users")).toHaveLength(1);
  });

  it("rejects untrusted request origins and callback URLs", async () => {
    const { auth, sendMagicLink, request } = await makeAuthFixture();
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
    expect(sendMagicLink).not.toHaveBeenCalled();
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
    const { auth, request, sendMagicLink, pending } = await makeAuthFixture();
    const delivery = Promise.withResolvers<undefined>();
    let webUrl: string | undefined;
    sendMagicLink.mockImplementationOnce(() =>
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

  it("keeps profile updates outside this foundation", async () => {
    const { auth, request } = await makeAuthFixture();
    const response = await auth.client.handler(
      request("/update-user", { image: "https://example.com/photo.png" }),
    );
    expect(response.status).toBe(404);
  });
});
