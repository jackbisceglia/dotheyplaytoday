import { Effect, Layer, Match, Schedule } from "effect";
import {
  NotifierContext,
  NotifierRequestError,
  NotifierResponseError,
  type NotifierError,
  type NotifierMessage,
} from "../service";
import { ResendClientService } from "./client";
import { ResendConfig } from "./config";

const constraints = { retry: { max: 2 } };

const retryPolicy = Schedule.exponential("250 millis").pipe(
  Schedule.intersect(Schedule.recurs(constraints.retry.max)),
);

const isRetriableError = (error: NotifierError) =>
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

const ResendProviderInternal = Effect.gen(function* () {
  const resendClient = yield* ResendClientService;
  const config = yield* ResendConfig;

  const send = Effect.fn("ResendProvider.send")(
    (message: NotifierMessage) =>
      Effect.suspend(() =>
        resendClient
          .sendEmail({
            from: config.from,
            to: message.to,
            subject: message.title,
            text: message.body,
          })
          .pipe(
            Effect.mapError((error) =>
              NotifierRequestError.make({
                channel: message.channel,
                message: "Failed to reach Resend API",
                cause: error.cause,
              }),
            ),
            Effect.flatMap((response) =>
              response.error
                ? Effect.fail(
                    NotifierResponseError.make({
                      channel: message.channel,
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

export const ResendProvider = {
  DefaultWithoutDependencies: ResendProviderInternal.pipe(
    Layer.effect(NotifierContext),
  ),
  Default: ResendProviderInternal.pipe(
    Layer.effect(NotifierContext),
    Layer.provide(ResendClientService.Default),
  ),
};
