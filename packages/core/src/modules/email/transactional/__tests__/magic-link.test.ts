import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, Effect, Layer, Schema } from "effect";
import type {
  CreateEmailOptions,
  CreateEmailRequestOptions,
  CreateEmailResponse,
} from "resend";
import { beforeEach, vi } from "vitest";

import { Id } from "../../../../lib/id/service.js";
import { EmailAddressFromString } from "../../../users/schema.js";
import { MagicLink, renderMagicLink, sendMagicLink } from "../magic-link.js";

const resendMock = vi.hoisted(() => ({
  constructor: vi.fn(),
  send: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    readonly emails = { send: resendMock.send };

    constructor(apiKey: string) {
      resendMock.constructor(apiKey);
    }
  },
}));

const successResponse: CreateEmailResponse = {
  data: { id: "email-id" },
  error: null,
  headers: null,
};

const ConfigLayerTest = ConfigProvider.layer(
  ConfigProvider.fromEnv({
    env: {
      VITE_WEB_URL_BASE: "https://dotheyplay.today",
      RESEND_API_KEY: "re_test_key",
      EMAIL_FROM_ADDRESS: "sender@example.com",
    },
  }),
);

const IdLayerTest = Layer.succeed(
  Id,
  Id.of({
    generate: () => Effect.succeed("magic-link-delivery-id"),
    makeFromBrandedSchema: (schema) =>
      Effect.succeed(schema.make("magic-link-delivery-id")),
  }),
);

const magicLink = MagicLink.make({
  recipient: Schema.decodeUnknownSync(EmailAddressFromString)(
    "user@example.com",
  ),
  url: "https://api.dotheyplay.today/api/auth/magic-link/verify?token=secret",
});

describe("magic-link email", () => {
  beforeEach(() => {
    resendMock.constructor.mockReset();
    resendMock.send.mockReset();
    resendMock.send.mockResolvedValue(successResponse);
  });

  it.effect("renders a transactional sign-in link", () =>
    Effect.gen(function* () {
      const rendered = yield* renderMagicLink(magicLink);

      expect(rendered.subject).toBe("Sign in to dotheyplaytoday");
      expect(rendered.body.text).toContain("Sign in:");
      expect(rendered.body.html).toContain("token=secret");
    }).pipe(Effect.provide(ConfigLayerTest)),
  );

  it.effect("delivers through the transactional email service", () =>
    Effect.gen(function* () {
      yield* sendMagicLink(magicLink);

      const [payload, options] = resendMock.send.mock.calls[0] as [
        CreateEmailOptions,
        CreateEmailRequestOptions,
      ];

      expect(payload).toMatchObject({
        from: "dotheyplaytoday <sender@example.com>",
        to: "user@example.com",
        subject: "Sign in to dotheyplaytoday",
      });
      expect(options).toEqual({ idempotencyKey: "magic-link-delivery-id" });
    }).pipe(Effect.provide([IdLayerTest, ConfigLayerTest])),
  );
});
