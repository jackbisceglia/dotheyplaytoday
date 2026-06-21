import { Effect, Layer, Match, Redacted, Schedule, Schema } from "effect";
import { Resend } from "resend";

import {
  ChannelClientRequestError,
  ChannelClientResponseError,
  type ChannelClientError,
} from "../../errors.js";
import { EmailChannelClient } from "./service.js";
import { ResendConfig } from "./config.js";

const constraints = { retry: { max: 2 } };

const retryPolicy = Schedule.exponential("250 millis").pipe(
  Schedule.both(Schedule.recurs(constraints.retry.max)),
);

const isRetriableError = (error: ChannelClientError) =>
  Match.value(error).pipe(
    Match.tag("ChannelClientRequestError", () => true),
    Match.tag("ChannelClientResponseError", (responseError) =>
      Match.value(responseError).pipe(
        Match.whenOr(
          { statusCode: 429 },
          ({ statusCode }) => (statusCode ?? -1) >= 500,
          () => true,
        ),
        Match.whenOr(
          { code: "application_error" },
          { code: "internal_server_error" },
          { code: "rate_limit_exceeded" },
          () => true,
        ),
        Match.orElse(() => false),
      ),
    ),
    Match.exhaustive,
  );

export class ResendInstantiationError extends Schema.TaggedErrorClass<ResendInstantiationError>()(
  "ResendInstantiationError",
  { cause: Schema.Defect() },
) {}

export class ResendRequestError extends Schema.TaggedErrorClass<ResendRequestError>()(
  "ResendRequestError",
  { cause: Schema.Defect() },
) {}

export const EmailChannelClientLayerResend = Layer.effect(
  EmailChannelClient,
  Effect.gen(function* () {
    const config = yield* ResendConfig;

    const client = yield* Effect.try({
      try: () => new Resend(Redacted.value(config.apiKey)),
      catch: (cause) => new ResendInstantiationError({ cause }),
    });

    const use = <A>(f: (client: Resend) => PromiseLike<A>) =>
      Effect.tryPromise({
        try: () => f(client),
        catch: (cause) => new ResendRequestError({ cause }),
      });

    const send: EmailChannelClient["Service"]["send"] = Effect.fn(
      "EmailChannelClient.resend.send",
    )(
      function* (delivery, rendered) {
        const response = yield* use((client) =>
          client.emails.send(
            {
              from: config.from,
              to: delivery.recipient,
              subject: rendered.subject,
              text: rendered.body.text,
              html: rendered.body.html,
            },
            { idempotencyKey: delivery.hash },
          ),
        );

        if (response.error) {
          return yield* new ChannelClientResponseError({
            channel: "email",
            message: response.error.message,
            code: response.error.name,
            statusCode: response.error.statusCode,
          });
        }
      },
      Effect.catchTag("ResendRequestError", (error) =>
        Effect.fail(
          new ChannelClientRequestError({
            channel: "email",
            message: "Failed to reach Resend API",
            cause: error.cause,
          }),
        ),
      ),
      Effect.retry({ schedule: retryPolicy, while: isRetriableError }),
    );

    return EmailChannelClient.of({ send });
  }),
);
