import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, Effect, Layer } from "effect";
import type { CreateEmailOptions, CreateEmailResponse } from "resend";

import {
  Notifier as NotifierProvider,
  type NotifierMessage,
} from "../modules/notifiers/providers/service";
import {
  ResendClientRequestError,
  ResendClientService,
} from "../modules/notifiers/providers/resend/client";
import { ResendProvider } from "../modules/notifiers/providers/resend/service";

const message: NotifierMessage = {
  channel: "email",
  to: "fan@example.com",
  title: "Celtics vs. Raptors, 7:30 PM EST",
  body: "Celtics play today.",
};

const successResponse: CreateEmailResponse = {
  data: { id: "email-id" },
  error: null,
  headers: null,
};

type ResendEmailError = Exclude<CreateEmailResponse["error"], null>;

const makeErrorResponse = (opts: {
  code: ResendEmailError["name"];
  statusCode: number | null;
  message: string;
}): CreateEmailResponse => ({
  data: null,
  error: {
    name: opts.code,
    statusCode: opts.statusCode,
    message: opts.message,
  },
  headers: null,
});

const makeLayer = (
  sendEmail: (
    payload: CreateEmailOptions,
  ) => Effect.Effect<CreateEmailResponse, ResendClientRequestError>,
) => {
  const resendClient = ResendClientService.make({ sendEmail });
  const resendClientLayer = Layer.succeed(ResendClientService, resendClient);

  const configLayer = Layer.setConfigProvider(
    ConfigProvider.fromMap(
      new Map<string, string>([["RESEND_FROM_EMAIL", "sender@example.com"]]),
    ),
  );

  return ResendProvider.pipe(
    Layer.provideMerge(resendClientLayer),
    Layer.provideMerge(configLayer),
  );
};

describe("ResendProvider", () => {
  it.effect("should map resend API errors to response errors", () => {
    const layer = makeLayer(() =>
      Effect.succeed(
        makeErrorResponse({
          code: "validation_error",
          statusCode: 422,
          message: "Invalid recipient",
        }),
      ),
    );

    return Effect.gen(function* () {
      const provider = yield* NotifierProvider;
      const result = yield* Effect.either(provider.send(message));

      expect(result._tag).toBe("Left");
      if (result._tag === "Left") {
        expect(result.left._tag).toBe("NotifierResponseError");
      }
    }).pipe(Effect.provide(layer));
  });

  it.live(
    "should retry transient response failures and eventually succeed",
    () => {
      let attempts = 0;

      const layer = makeLayer((_payload) => {
        attempts += 1;

        if (attempts < 2) {
          return Effect.succeed(
            makeErrorResponse({
              code: "application_error",
              statusCode: 500,
              message: "Temporary outage",
            }),
          );
        }

        return Effect.succeed(successResponse);
      });

      return Effect.gen(function* () {
        const provider = yield* NotifierProvider;
        const result = yield* Effect.either(provider.send(message));

        expect(result._tag).toBe("Right");
        expect(attempts).toBe(2);
      }).pipe(Effect.provide(layer));
    },
  );

  it.live("should retry request failures from the resend client", () => {
    let attempts = 0;

    const layer = makeLayer((_payload) => {
      attempts += 1;

      if (attempts < 3) {
        return Effect.fail(
          ResendClientRequestError.make({ cause: new Error("network") }),
        );
      }

      return Effect.succeed(successResponse);
    });

    return Effect.gen(function* () {
      const provider = yield* NotifierProvider;
      const result = yield* Effect.either(provider.send(message));

      expect(result._tag).toBe("Right");
      expect(attempts).toBe(3);
    }).pipe(Effect.provide(layer));
  });

  it.effect("should not retry non-transient response failures", () => {
    let attempts = 0;

    const layer = makeLayer((_payload) => {
      attempts += 1;

      return Effect.succeed(
        makeErrorResponse({
          code: "validation_error",
          statusCode: 422,
          message: "Bad request",
        }),
      );
    });

    return Effect.gen(function* () {
      const provider = yield* NotifierProvider;
      const result = yield* Effect.either(provider.send(message));

      expect(result._tag).toBe("Left");
      if (result._tag === "Left") {
        expect(result.left._tag).toBe("NotifierResponseError");
      }
      expect(attempts).toBe(1);
    }).pipe(Effect.provide(layer));
  });
});
