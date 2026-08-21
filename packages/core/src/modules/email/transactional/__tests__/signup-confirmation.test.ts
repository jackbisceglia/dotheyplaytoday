import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, Effect, Layer, Schema } from "effect";
import type {
  CreateEmailOptions,
  CreateEmailRequestOptions,
  CreateEmailResponse,
} from "resend";
import { beforeEach, vi } from "vitest";

import { Id } from "../../../../lib/id/service.js";
import { notification } from "../../../channels/__tests__/fixtures.js";
import { ChannelClientResponseError } from "../../../channels/errors.js";
import {
  renderSignupConfirmation,
  sendSignupConfirmation,
  SignupConfirmation,
} from "../signup-confirmation.js";

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

const WebConfigLayerTest = ConfigProvider.layer(
  ConfigProvider.fromEnv({
    env: {
      VITE_WEB_URL_BASE: "https://example.com",
      VITE_WEB_URL_PORT: "8080",
      RESEND_API_KEY: "re_test_key",
      RESEND_FROM_EMAIL: "sender@example.com",
    },
  }),
);

const IdLayerTest = Layer.succeed(
  Id,
  Id.of({
    generate: () => Effect.succeed("confirmation-delivery-id"),
    makeFromBrandedSchema: (schema) =>
      Effect.succeed(schema.make("00000000-0000-4000-8000-000000000999")),
  }),
);

const signupConfirmation = SignupConfirmation.cases.firstSignup.make({
  user: notification.user,
  subjects: [
    notification.subject,
    {
      ...notification.subject,
      details: {
        ...notification.subject.details,
        location: "New York",
        name: "Knicks & Nets",
        display: "New York Knicks & Nets <Team>",
        abbreviation: "NYK",
        slug: "new-york-knicks",
      },
    },
  ],
  schedule: notification.subscription.schedule,
});

const repeatConfirmation = SignupConfirmation.cases.repeatSignup.make({
  user: signupConfirmation.user,
  subjects: signupConfirmation.subjects,
  schedule: signupConfirmation.schedule,
});

describe("signup confirmation email", () => {
  beforeEach(() => {
    resendMock.constructor.mockReset();
    resendMock.send.mockReset();
    resendMock.send.mockResolvedValue(successResponse);
  });

  it("decodes both confirmation variants", () => {
    const decode = Schema.decodeUnknownSync(SignupConfirmation);
    const encode = Schema.encodeUnknownSync(SignupConfirmation);

    expect(decode(encode(signupConfirmation))._tag).toBe("firstSignup");
    expect(decode(encode(repeatConfirmation))._tag).toBe("repeatSignup");
  });

  it.effect("renders distinct, complete text and HTML receipts", () =>
    Effect.gen(function* () {
      const first = yield* renderSignupConfirmation(signupConfirmation);
      const repeat = yield* renderSignupConfirmation(repeatConfirmation);

      expect(first.subject).toBe("Welcome to dotheyplaytoday");
      expect(first.body.text).toContain("You're on the roster");
      expect(repeat.subject).toBe("Your Picks are Updated");
      expect(repeat.body.text).not.toContain("Your picks are updated");
      expect(repeat.body.text).toContain("previous picks have been replaced");

      for (const rendered of [first, repeat]) {
        expect(rendered.body.text).toContain("Boston Celtics");
        expect(rendered.body.text).toContain("New York Knicks & Nets <Team>");
        expect(rendered.body.text).toContain("9:00 AM ET");
        expect(rendered.body.text).not.toContain("America/New_York");
        expect(rendered.body.text).toContain(
          "https://example.com:8080/unsubscribe/00000000-0000-4000-8000-000000000201",
        );
        expect(rendered.body.html).toContain("Boston Celtics");
        expect(rendered.body.html).toContain(
          "New York Knicks &amp; Nets &lt;Team&gt;",
        );
        expect(rendered.body.html).not.toContain(
          "New York Knicks & Nets <Team>",
        );
      }
    }).pipe(Effect.provide(WebConfigLayerTest)),
  );

  it.effect("sends through Resend with one generated delivery ID", () =>
    Effect.gen(function* () {
      yield* sendSignupConfirmation(signupConfirmation);

      expect(resendMock.constructor).toHaveBeenCalledWith("re_test_key");
      expect(resendMock.send).toHaveBeenCalledOnce();

      const [payload, options] = resendMock.send.mock.calls[0] as [
        CreateEmailOptions,
        CreateEmailRequestOptions,
      ];

      expect(payload).toMatchObject({
        from: "sender@example.com",
        to: "fan@example.com",
        subject: "Welcome to dotheyplaytoday",
      });
      expect(options).toEqual({
        idempotencyKey: "confirmation-delivery-id",
      });
    }).pipe(Effect.provide([IdLayerTest, WebConfigLayerTest])),
  );

  it.effect("maps typed provider failures", () => {
    const expected = new ChannelClientResponseError({
      channel: "email",
      message: "Rejected",
      code: "validation_error",
      statusCode: 422,
    });

    resendMock.send.mockResolvedValue({
      data: null,
      error: {
        name: "validation_error",
        message: expected.message,
        statusCode: expected.statusCode,
      },
      headers: null,
    } satisfies CreateEmailResponse);

    return Effect.gen(function* () {
      const error = yield* sendSignupConfirmation(signupConfirmation).pipe(
        Effect.flip,
      );

      expect(error).toStrictEqual(expected);
    }).pipe(Effect.provide([IdLayerTest, WebConfigLayerTest]));
  });
});
