import { Effect, Layer, Match, Redacted, Schedule, Schema } from "effect";
import { Resend } from "resend";

import {
  EmailRequestError,
  EmailResponseError,
  type EmailError,
} from "../notifier/errors.js";
import { Email } from "./service.js";
import { ResendConfig } from "./config.js";

const constraints = { retry: { max: 2 } };

const retryPolicy = Schedule.exponential("250 millis").pipe(
  Schedule.upTo({ times: constraints.retry.max }),
);

const isRetriableError = (error: EmailError) =>
  Match.value(error).pipe(
    Match.tag("EmailRequestError", () => true),
    Match.tag("EmailResponseError", (responseError) =>
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

export const EmailLayerResend = Layer.effect(
  Email,
  Effect.gen(function* () {
    const config = yield* ResendConfig;

    const client = yield* Effect.try({
      try: () => new Resend(Redacted.value(config.apiKey)),
      catch: (cause) => new ResendInstantiationError({ cause }),
    });

    const from = `${config.from.name} <${config.from.email}>`;

    const use = <A>(f: (client: Resend) => PromiseLike<A>) =>
      Effect.tryPromise({
        try: () => f(client),
        catch: (cause) => new ResendRequestError({ cause }),
      });

    const send: Email["Service"]["send"] = Effect.fn("Email.resend.send")(
      function* (message) {
        const response = yield* use((client) =>
          client.emails.send(
            {
              from,
              to: message.recipient,
              subject: message.subject,
              text: message.body.text,
              html: message.body.html,
              // Renders a native unsubscribe control in Gmail and Apple Mail.
              headers: {
                "List-Unsubscribe": `<${message.unsubscribeUrl}>`,
              },
            },
            { idempotencyKey: message.idempotencyKey },
          ),
        );

        if (response.error) {
          return yield* new EmailResponseError({
            channel: "email",
            message: response.error.message,
            code: response.error.name,
            statusCode: response.error.statusCode,
          });
        }
      },
      Effect.catchTag("ResendRequestError", (error) =>
        Effect.fail(
          new EmailRequestError({
            channel: "email",
            message: "Failed to reach Resend API",
            cause: error.cause,
          }),
        ),
      ),
      Effect.retry({ schedule: retryPolicy, while: isRetriableError }),
    );

    return Email.of({ send });
  }),
);
