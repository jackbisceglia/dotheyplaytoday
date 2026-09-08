import {
  EmailTestLayer,
  recipient,
  resendMock,
  resetEmailMock,
  url,
} from "./fixtures.js";
import { describe, expect, it } from "@effect/vitest";
import { Effect } from "effect";
import { beforeEach } from "vitest";

import { EmailResponseError } from "../../errors.js";
import { renderSignInLink, sendSignInLink } from "../sign-in.js";

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
