import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, Effect, Either, Layer, Ref } from "effect";
import type { CreateEmailOptions, CreateEmailResponse } from "resend";

import {
  EmailProvider,
  type EmailMessage,
} from "../modules/notifier/email/providers.js";
import {
  ResendClientRequestError,
  ResendClientService,
} from "../modules/notifier/email/resend/client.js";
import { EmailProviderLayerResend } from "../modules/notifier/email/resend/index.js";

const message: EmailMessage = {
  to: "fan@example.com",
  subject: "Celtics vs. Raptors, 7:30 PM EST",
  text: "Celtics play today.",
  html: "<html><body><strong>Celtics play today.</strong></body></html>",
};

const textOnlyMessage: EmailMessage = {
  to: "fan@example.com",
  subject: "Celtics vs. Raptors, 7:30 PM EST",
  text: "Celtics play today.",
};

const successResponse: CreateEmailResponse = {
  data: { id: "email-id" },
  error: null,
  headers: null,
};

type ResendEmailError = Exclude<CreateEmailResponse["error"], null>;

type ErrorResponseOptions = {
  code: ResendEmailError["name"];
  statusCode: number | null;
  message: string;
};

const makeErrorResponse = (
  options: ErrorResponseOptions,
): CreateEmailResponse => ({
  data: null,
  error: {
    name: options.code,
    statusCode: options.statusCode,
    message: options.message,
  },
  headers: null,
});

const ResendConfigLayerTest = Layer.setConfigProvider(
  ConfigProvider.fromMap(
    new Map<string, string>([
      ["RESEND_API_KEY", "re_test_key"],
      ["RESEND_FROM_EMAIL", "sender@example.com"],
    ]),
  ),
);

const makeEmailProviderLayerResendTest = (
  sendEmail: (
    payload: CreateEmailOptions,
  ) => Effect.Effect<CreateEmailResponse, ResendClientRequestError>,
) => {
  const ResendClientLayerTest = Layer.succeed(
    ResendClientService,
    ResendClientService.make({ sendEmail }),
  );

  const EmailProviderLayerResendTest =
    EmailProviderLayerResend.layerWithoutDependencies.pipe(
      Layer.provideMerge(ResendClientLayerTest),
      Layer.provideMerge(ResendConfigLayerTest),
    );

  return EmailProviderLayerResendTest;
};

const sendMessageEither = () =>
  EmailProvider.pipe(
    Effect.flatMap((emailProvider) => emailProvider.send(message)),
    Effect.either,
  );

const sendTextOnlyMessageEither = () =>
  EmailProvider.pipe(
    Effect.flatMap((emailProvider) => emailProvider.send(textOnlyMessage)),
    Effect.either,
  );

describe("EmailProviderLayerResend", () => {
  it.effect("should map resend API errors to response errors", () => {
    return Effect.gen(function* () {
      const EmailProviderLayerResendTest = makeEmailProviderLayerResendTest(
        (payload) =>
          Effect.sync(() => {
            expect(payload.from).toBe("sender@example.com");
            expect(payload.to).toBe(message.to);
            expect(payload.subject).toBe(message.subject);
            expect(payload.text).toBe(message.text);
            expect(payload.html).toBe(message.html);

            return makeErrorResponse({
              code: "validation_error",
              statusCode: 422,
              message: "Invalid recipient",
            });
          }),
      );

      const result = yield* sendMessageEither().pipe(
        Effect.provide(EmailProviderLayerResendTest),
      );

      Either.match(result, {
        onLeft: (error) => {
          switch (error._tag) {
            case "NotifierResponseError": {
              expect(error.channel).toBe("email");
              expect(error.message).toBe("Invalid recipient");
              expect(error.code).toBe("validation_error");
              expect(error.statusCode).toBe(422);
              break;
            }
            default:
              expect.fail(`Expected NotifierResponseError, got ${error._tag}`);
          }
        },
        onRight: () => expect.fail("Expected provider send to fail"),
      });
    });
  });

  it.live(
    "should retry transient response failures and eventually succeed",
    () =>
      Effect.gen(function* () {
        const attemptsRef = yield* Ref.make(0);

        const EmailProviderLayerResendTest = makeEmailProviderLayerResendTest(
          (_payload) =>
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
        );

        const result = yield* sendMessageEither().pipe(
          Effect.provide(EmailProviderLayerResendTest),
        );

        Either.match(result, {
          onLeft: (error) =>
            expect.fail(`Expected provider send to succeed, got ${error._tag}`),
          onRight: () => undefined,
        });

        const attempts = yield* Ref.get(attemptsRef);
        expect(attempts).toBe(2);
      }),
  );

  it.live("should retry request failures from the resend client", () =>
    Effect.gen(function* () {
      const attemptsRef = yield* Ref.make(0);

      const EmailProviderLayerResendTest = makeEmailProviderLayerResendTest(
        (_payload) =>
          Ref.updateAndGet(attemptsRef, (value) => value + 1).pipe(
            Effect.flatMap((attempt) =>
              attempt < 3
                ? ResendClientRequestError.make({ cause: new Error("network") })
                : Effect.succeed(successResponse),
            ),
          ),
      );

      const result = yield* sendMessageEither().pipe(
        Effect.provide(EmailProviderLayerResendTest),
      );

      Either.match(result, {
        onLeft: (error) =>
          expect.fail(`Expected provider send to succeed, got ${error._tag}`),
        onRight: () => undefined,
      });

      const attempts = yield* Ref.get(attemptsRef);
      expect(attempts).toBe(3);
    }),
  );

  it.live(
    "should fail after retry exhaustion for transient response failures",
    () =>
      Effect.gen(function* () {
        const attemptsRef = yield* Ref.make(0);

        const EmailProviderLayerResendTest = makeEmailProviderLayerResendTest(
          (_payload) =>
            Ref.updateAndGet(attemptsRef, (value) => value + 1).pipe(
              Effect.as(
                makeErrorResponse({
                  code: "application_error",
                  statusCode: 500,
                  message: "Temporary outage",
                }),
              ),
            ),
        );

        const result = yield* sendMessageEither().pipe(
          Effect.provide(EmailProviderLayerResendTest),
        );

        Either.match(result, {
          onLeft: (error) => {
            switch (error._tag) {
              case "NotifierResponseError": {
                expect(error.channel).toBe("email");
                expect(error.message).toBe("Temporary outage");
                expect(error.code).toBe("application_error");
                expect(error.statusCode).toBe(500);
                break;
              }
              default:
                expect.fail(
                  `Expected NotifierResponseError, got ${error._tag}`,
                );
            }
          },
          onRight: () => expect.fail("Expected provider send to fail"),
        });

        const attempts = yield* Ref.get(attemptsRef);
        expect(attempts).toBe(3);
      }),
  );

  it.live("should fail after retry exhaustion for request failures", () =>
    Effect.gen(function* () {
      const attemptsRef = yield* Ref.make(0);

      const EmailProviderLayerResendTest = makeEmailProviderLayerResendTest(
        (_payload) =>
          Ref.updateAndGet(attemptsRef, (value) => value + 1).pipe(
            Effect.zipRight(
              ResendClientRequestError.make({ cause: new Error("network") }),
            ),
          ),
      );

      const result = yield* sendMessageEither().pipe(
        Effect.provide(EmailProviderLayerResendTest),
      );

      Either.match(result, {
        onLeft: (error) => {
          switch (error._tag) {
            case "NotifierRequestError": {
              expect(error.channel).toBe("email");
              expect(error.message).toBe("Failed to reach Resend API");
              expect(error.cause).toBeDefined();
              break;
            }
            default:
              expect.fail(`Expected NotifierRequestError, got ${error._tag}`);
          }
        },
        onRight: () => expect.fail("Expected provider send to fail"),
      });

      const attempts = yield* Ref.get(attemptsRef);
      expect(attempts).toBe(3);
    }),
  );

  it.effect("should not retry non-transient response failures", () =>
    Effect.gen(function* () {
      const attemptsRef = yield* Ref.make(0);

      const EmailProviderLayerResendTest = makeEmailProviderLayerResendTest(
        (_payload) =>
          Ref.updateAndGet(attemptsRef, (value) => value + 1).pipe(
            Effect.as(
              makeErrorResponse({
                code: "validation_error",
                statusCode: 422,
                message: "Bad request",
              }),
            ),
          ),
      );

      const result = yield* sendMessageEither().pipe(
        Effect.provide(EmailProviderLayerResendTest),
      );

      Either.match(result, {
        onLeft: (error) => {
          expect(error._tag).toBe("NotifierResponseError");
        },
        onRight: () => expect.fail("Expected provider send to fail"),
      });

      const attempts = yield* Ref.get(attemptsRef);
      expect(attempts).toBe(1);
    }),
  );

  it.effect("should pass rendered html through to resend", () => {
    return Effect.gen(function* () {
      const EmailProviderLayerResendTest = makeEmailProviderLayerResendTest(
        (payload) =>
          Effect.sync(() => {
            expect(payload).toMatchObject({
              from: "sender@example.com",
              to: message.to,
              subject: message.subject,
              text: message.text,
              html: message.html,
            });

            return successResponse;
          }),
      );

      const result = yield* sendMessageEither().pipe(
        Effect.provide(EmailProviderLayerResendTest),
      );

      Either.match(result, {
        onLeft: (error) =>
          expect.fail(`Expected provider send to succeed, got ${error._tag}`),
        onRight: () => undefined,
      });
    });
  });

  it.effect(
    "should omit html when the rendered message does not include it",
    () => {
      return Effect.gen(function* () {
        const EmailProviderLayerResendTest = makeEmailProviderLayerResendTest(
          (payload) =>
            Effect.sync(() => {
              expect(payload).toMatchObject({
                from: "sender@example.com",
                to: textOnlyMessage.to,
                subject: textOnlyMessage.subject,
                text: textOnlyMessage.text,
              });
              expect(payload.html).toBeUndefined();

              return successResponse;
            }),
        );

        const result = yield* sendTextOnlyMessageEither().pipe(
          Effect.provide(EmailProviderLayerResendTest),
        );

        Either.match(result, {
          onLeft: (error) =>
            expect.fail(`Expected provider send to succeed, got ${error._tag}`),
          onRight: () => undefined,
        });
      });
    },
  );
});
