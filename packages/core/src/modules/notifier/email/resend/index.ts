import { Effect, Layer, Match, Schedule } from "effect";

import {
  NotifierRequestError,
  NotifierResponseError,
  type NotifierTransportError,
} from "../../errors.js";
import { EmailProvider, type EmailMessage } from "../providers.js";
import { ResendClientService } from "./client.js";
import { ResendConfig } from "./config.js";

const constraints = { retry: { max: 2 } };

const retryPolicy = Schedule.exponential("250 millis").pipe(
  Schedule.intersect(Schedule.recurs(constraints.retry.max)),
);

const isRetriableError = (error: NotifierTransportError) =>
  Match.value(error).pipe(
    Match.tag("NotifierRequestError", () => true),
    Match.tag("NotifierResponseError", (responseError) =>
      Match.value(responseError).pipe(
        Match.whenOr(
          { statusCode: 429 },
          ({ statusCode }) => (statusCode ?? -1) >= 500,
          () => true,
        ),
        Match.whenOr(
          { code: "rate_limit_exceeded" },
          { code: "application_error" },
          { code: "internal_server_error" },
          () => true,
        ),
        Match.orElse(() => false),
      ),
    ),
    Match.exhaustive,
  );

const EmailProviderLayerResendInternal = Effect.gen(function* () {
  const resendClient = yield* ResendClientService;
  const config = yield* ResendConfig;

  const send = Effect.fn("EmailProvider.send")(
    (message: EmailMessage) =>
      Effect.suspend(() =>
        resendClient
          .sendEmail({
            from: config.from,
            to: message.to,
            subject: message.subject,
            text: message.text,
            ...(message.html ? { html: message.html } : {}),
          })
          .pipe(
            Effect.mapError((error) =>
              NotifierRequestError.make({
                channel: "email",
                message: "Failed to reach Resend API",
                cause: error.cause,
              }),
            ),
            Effect.flatMap((response) =>
              response.error
                ? Effect.fail(
                    NotifierResponseError.make({
                      channel: "email",
                      message: response.error.message,
                      code: response.error.name,
                      statusCode: response.error.statusCode,
                    }),
                  )
                : Effect.void,
            ),
          ),
      ),
    Effect.retry({ schedule: retryPolicy, while: isRetriableError }),
  );

  return { send };
});

export const EmailProviderLayerResend = {
  layerWithoutDependencies: EmailProviderLayerResendInternal.pipe(
    Layer.effect(EmailProvider),
  ),
  layer: EmailProviderLayerResendInternal.pipe(
    Layer.effect(EmailProvider),
    Layer.provide(ResendClientService.Default),
  ),
};
