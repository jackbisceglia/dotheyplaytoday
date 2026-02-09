import { Effect, Redacted, Schema } from "effect";
import type { CreateEmailOptions, CreateEmailResponse } from "resend";
import { Resend } from "resend";

const ResendApiKey = Schema.Redacted(Schema.NonEmptyString);

export class ResendClientInstantiationError extends Schema.TaggedError<ResendClientInstantiationError>()(
  "ResendClientInstantiationError",
  { cause: Schema.Defect },
) {}

export class ResendClientRequestError extends Schema.TaggedError<ResendClientRequestError>()(
  "ResendClientRequestError",
  { cause: Schema.Defect },
) {}

export class ResendClientService extends Effect.Service<ResendClientService>()(
  "@dtpt/notifier/providers/resend/ResendClientService",
  {
    effect: Effect.gen(function* () {
      const apiKey = yield* Schema.Config("RESEND_API_KEY", ResendApiKey);

      const client = yield* Effect.try({
        try: () => new Resend(Redacted.value(apiKey)),
        catch: (cause) => ResendClientInstantiationError.make({ cause }),
      });

      const sendEmail = (payload: CreateEmailOptions) =>
        Effect.tryPromise({
          try: () => client.emails.send(payload),
          catch: (cause) => ResendClientRequestError.make({ cause }),
        });

      return { sendEmail };
    }),
  },
) {}

export type ResendSendEmailResponse = CreateEmailResponse;
