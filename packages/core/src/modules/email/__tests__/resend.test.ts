import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, Effect, Layer, Ref } from "effect";
import type {
  CreateEmailOptions,
  CreateEmailRequestOptions,
  CreateEmailResponse,
} from "resend";
import { beforeEach, vi } from "vitest";

import { EmailRequestError, EmailResponseError } from "../errors.js";
import { notification } from "../../notifier/__tests__/fixtures.js";
import { EmailAddress } from "../../users/schema.js";
import type { EmailRendered } from "../render.js";
import { Email } from "../service.js";
import {
  EmailLayerResend,
  makeEmailLayerResend,
  ResendInstantiationError,
} from "../resend.js";

const resendMock = vi.hoisted(() => ({
  constructor: vi.fn(),
  send: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    readonly emails = {
      send: resendMock.send,
    };

    constructor(apiKey: string) {
      resendMock.constructor(apiKey);
    }
  },
}));

const rendered: EmailRendered = {
  subject: "Boston Celtics play today",
  unsubscribeUrl: "https://example.com/unsubscribe/token",
  body: {
    text: "New York Knicks at Boston Celtics, 4:00 PM EDT",
    html: "<p>New York Knicks at Boston Celtics, 4:00 PM EDT</p>",
  },
};

const successResponse: CreateEmailResponse = {
  data: { id: "email-id" },
  error: null,
  headers: null,
};

type ResendEmailError = Exclude<CreateEmailResponse["error"], null>;

const makeErrorResponse = (options: {
  readonly code: ResendEmailError["name"];
  readonly statusCode: ResendEmailError["statusCode"];
  readonly message: string;
}): CreateEmailResponse => ({
  data: null,
  error: {
    name: options.code,
    statusCode: options.statusCode,
    message: options.message,
  },
  headers: null,
});

const ResendConfigLayerTest = ConfigProvider.layer(
  ConfigProvider.fromEnv({
    env: {
      RESEND_API_KEY: "re_test_key",
      RESEND_FROM_EMAIL: "sender@example.com",
    },
  }),
);

const EmailLayerTest = EmailLayerResend.pipe(
  Layer.provideMerge(ResendConfigLayerTest),
);

const EmailLayerStaticTest = makeEmailLayerResend({
  from: {
    name: "dotheyplaytoday ops",
    email: EmailAddress.make("ops@dotheyplay.today"),
  },
}).pipe(Layer.provideMerge(ResendConfigLayerTest));

const sendRendered = Effect.gen(function* () {
  const email = yield* Email;

  yield* email.send(
    {
      recipient: notification.user.email,
      idempotencyKey:
        "00000000-0000-4000-8000-000000000401:2026-05-24T13:00:00.000Z",
    },
    rendered,
  );
}).pipe(Effect.provide(EmailLayerTest));

describe("EmailLayerResend", () => {
  beforeEach(() => {
    resendMock.constructor.mockReset();
    resendMock.send.mockReset();
  });

  it.effect("maps rendered email content to the Resend payload", () =>
    Effect.gen(function* () {
      resendMock.send.mockImplementation(
        (
          payload: CreateEmailOptions,
          options: CreateEmailRequestOptions | undefined,
        ) => {
          expect(payload).toEqual({
            from: "dotheyplaytoday <sender@example.com>",
            to: notification.user.email,
            subject: rendered.subject,
            text: rendered.body.text,
            html: rendered.body.html,
            headers: {
              "List-Unsubscribe": `<${rendered.unsubscribeUrl}>`,
            },
          });
          expect(options).toEqual({
            idempotencyKey:
              "00000000-0000-4000-8000-000000000401:2026-05-24T13:00:00.000Z",
          });

          return Promise.resolve(successResponse);
        },
      );

      yield* sendRendered;

      expect(resendMock.constructor).toHaveBeenCalledWith("re_test_key");
      expect(resendMock.send).toHaveBeenCalledOnce();
    }),
  );

  it.effect("supports a statically configured sender", () =>
    Effect.gen(function* () {
      resendMock.send.mockImplementation((payload: CreateEmailOptions) => {
        expect(payload.from).toBe("dotheyplaytoday ops <ops@dotheyplay.today>");

        return Promise.resolve(successResponse);
      });

      const email = yield* Email;

      yield* email.send(
        {
          recipient: notification.user.email,
          idempotencyKey: "ops-delivery-id",
        },
        rendered,
      );
    }).pipe(Effect.provide(EmailLayerStaticTest)),
  );

  it.effect(
    "surfaces Resend instantiation failures before request mapping",
    () =>
      Effect.gen(function* () {
        resendMock.constructor.mockImplementation(() => {
          throw new Error("bad api key");
        });

        const error = yield* Effect.gen(function* () {
          yield* Email;
        }).pipe(Effect.provide(EmailLayerTest), Effect.flip);

        expect(error).toBeInstanceOf(ResendInstantiationError);
      }),
  );

  it.effect("maps Resend provider errors to email response errors", () =>
    Effect.gen(function* () {
      resendMock.send.mockResolvedValue(
        makeErrorResponse({
          code: "validation_error",
          statusCode: 422,
          message: "Invalid recipient",
        }),
      );

      const error = yield* sendRendered.pipe(Effect.flip);

      expect(error).toBeInstanceOf(EmailResponseError);
      if (error._tag !== "EmailResponseError") {
        return expect.fail(`Expected response error, got ${error._tag}`);
      }
      expect(error.message).toBe("Invalid recipient");
      expect(error.code).toBe("validation_error");
      expect(error.statusCode).toBe(422);
    }),
  );

  it.live("retries request failures from the Resend boundary", () =>
    Effect.gen(function* () {
      const attemptsRef = yield* Ref.make(0);
      resendMock.send.mockImplementation(() =>
        Effect.runPromise(
          Ref.updateAndGet(attemptsRef, (value) => value + 1).pipe(
            Effect.flatMap((attempt) =>
              attempt < 3
                ? Effect.promise(() => Promise.reject(new Error("network")))
                : Effect.succeed(successResponse),
            ),
          ),
        ),
      );

      yield* sendRendered;

      const attempts = yield* Ref.get(attemptsRef);
      expect(attempts).toBe(3);
    }),
  );

  it.live("retries transient response failures from Resend", () =>
    Effect.gen(function* () {
      const attemptsRef = yield* Ref.make(0);
      resendMock.send.mockImplementation(() =>
        Effect.runPromise(
          Ref.updateAndGet(attemptsRef, (value) => value + 1).pipe(
            Effect.map((attempt) =>
              attempt < 2
                ? makeErrorResponse({
                    code: "application_error",
                    statusCode: 500,
                    message: "Temporary outage",
                  })
                : successResponse,
            ),
          ),
        ),
      );

      yield* sendRendered;

      const attempts = yield* Ref.get(attemptsRef);
      expect(attempts).toBe(2);
    }),
  );

  it.live("fails with the final request error after retry exhaustion", () =>
    Effect.gen(function* () {
      const attemptsRef = yield* Ref.make(0);
      resendMock.send.mockImplementation(() =>
        Effect.runPromise(
          Ref.updateAndGet(attemptsRef, (value) => value + 1).pipe(
            Effect.flatMap(() =>
              Effect.promise(() => Promise.reject(new Error("network"))),
            ),
          ),
        ),
      );

      const error = yield* sendRendered.pipe(Effect.flip);

      expect(error).toBeInstanceOf(EmailRequestError);
      if (error._tag !== "EmailRequestError") {
        return expect.fail(`Expected request error, got ${error._tag}`);
      }
      expect(error.message).toBe("Failed to reach Resend API");

      const attempts = yield* Ref.get(attemptsRef);
      expect(attempts).toBe(3);
    }),
  );

  it.effect("does not retry non-transient response errors", () =>
    Effect.gen(function* () {
      resendMock.send.mockResolvedValue(
        makeErrorResponse({
          code: "validation_error",
          statusCode: 422,
          message: "Bad request",
        }),
      );

      const error = yield* sendRendered.pipe(Effect.flip);

      expect(error).toBeInstanceOf(EmailResponseError);
      expect(resendMock.send).toHaveBeenCalledOnce();
    }),
  );
});
