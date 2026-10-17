import {
  EmailTestLayer,
  recipient,
  resendMock,
  resetEmailMock,
  url,
  code,
} from "./fixtures.js";
import { describe, expect, it } from "@effect/vitest";
import { Effect } from "effect";
import { beforeEach } from "vitest";

import { EmailResponseError } from "../../errors.js";
import {
  renderSignInCode,
  renderSignInLink,
  sendSignInCode,
  sendSignInLink,
} from "../sign-in.js";

describe("sign-in email", () => {
  beforeEach(resetEmailMock);

  it.effect(
    "renders the action and unchanged URL in text and escaped HTML",
    () =>
      Effect.gen(function* () {
        const rendered = yield* renderSignInLink(url);
        expect(rendered.subject).toBe("Sign in to dotheyplaytoday");
        expect(rendered.body.text).toContain("Sign in:");
        expect(rendered.body.text).toContain(url);
        expect(rendered.body.text).toContain("15 minutes");
        expect(rendered.body.text).toContain("only be used once");
        expect(rendered.body.html).toContain(url.replaceAll("&", "&amp;"));
        expect(rendered.body.html).toContain(
          "/email/headlines/your-sign-in-link.png",
        );
        expect(rendered.body.html).toContain('alt="Your sign-in link."');
        expect(rendered.metadata).toBeUndefined();
      }).pipe(Effect.provide(EmailTestLayer)),
  );

  it.effect(
    "sends one email with the correct recipient, content, and idempotency key",
    () =>
      Effect.gen(function* () {
        yield* sendSignInLink(recipient, url);
        expect(resendMock.send).toHaveBeenCalledOnce();
        expect(resendMock.send.mock.calls[0]?.[0]).toMatchObject({
          from: "dotheyplaytoday <sender@example.com>",
          to: recipient,
          subject: "Sign in to dotheyplaytoday",
        });
        expect(resendMock.send.mock.calls[0]?.[0].text).toContain(url);
        expect(resendMock.send.mock.calls[0]?.[1]).toEqual({
          idempotencyKey: "delivery-id",
        });
      }).pipe(Effect.provide(EmailTestLayer)),
  );

  it.effect("preserves typed delivery failure", () => {
    resendMock.send.mockResolvedValue({
      data: null,
      error: { name: "validation_error", message: "Rejected", statusCode: 422 },
      headers: null,
    });
    return Effect.gen(function* () {
      const error = yield* sendSignInLink(recipient, url).pipe(Effect.flip);
      expect(error).toEqual(
        new EmailResponseError({
          code: "validation_error",
          message: "Rejected",
          statusCode: 422,
        }),
      );
      expect(resendMock.send).toHaveBeenCalledOnce();
    }).pipe(Effect.provide(EmailTestLayer));
  });
});

describe("sign-in code email", () => {
  beforeEach(resetEmailMock);

  it.effect("renders the code in text and HTML without a link", () =>
    Effect.gen(function* () {
      const rendered = yield* renderSignInCode(code);
      expect(rendered.subject).toBe("Your dotheyplaytoday sign-in code");
      expect(rendered.body.text).toContain(
        `Enter this code to sign in:\n\n${code}`,
      );
      expect(rendered.body.text).toContain("10 minutes");
      expect(rendered.body.text).toContain("only be used once");
      expect(rendered.body.html).toContain(`>${code}</p>`);
      expect(rendered.body.html).toContain(
        "/email/headlines/your-sign-in-code.png",
      );
      expect(rendered.body.html).not.toContain('href="https://api');
      // Keep the code out of inbox previews and lock-screen notifications.
      expect(rendered.body.html).not.toMatch(
        new RegExp(`display: none[^>]*>[^<]*${code}`),
      );
      expect(rendered.metadata).toBeUndefined();
    }).pipe(Effect.provide(EmailTestLayer)),
  );

  it.effect(
    "sends one email with the recipient, code, and idempotency key",
    () =>
      Effect.gen(function* () {
        yield* sendSignInCode(recipient, code);
        expect(resendMock.send).toHaveBeenCalledOnce();
        expect(resendMock.send.mock.calls[0]?.[0]).toMatchObject({
          from: "dotheyplaytoday <sender@example.com>",
          to: recipient,
          subject: "Your dotheyplaytoday sign-in code",
        });
        expect(resendMock.send.mock.calls[0]?.[0].text).toContain(code);
        expect(resendMock.send.mock.calls[0]?.[1]).toEqual({
          idempotencyKey: "delivery-id",
        });
      }).pipe(Effect.provide(EmailTestLayer)),
  );
});
