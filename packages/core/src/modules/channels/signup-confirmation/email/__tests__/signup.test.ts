import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, Effect, Layer, Schema } from "effect";

import { Id } from "../../../../../lib/id/service.js";
import { ChannelClientResponseError } from "../../../errors.js";
import type { ChannelDelivery } from "../../../client/service.js";
import type { EmailRendered } from "../../../email/clients/service.js";
import { EmailChannelClient } from "../../../email/clients/service.js";
import { signupConfirmation } from "../../../__tests__/fixtures.js";
import { SignupConfirmation } from "../../schema.js";
import { SignupConfirmationChannel } from "../../service.js";
import { SignupConfirmationEmailChannelLayer } from "../service.js";
import { renderSignupConfirmation } from "../render.js";

const WebConfigLayerTest = ConfigProvider.layer(
  ConfigProvider.fromEnv({
    env: {
      VITE_WEB_URL_BASE: "https://example.com",
      VITE_WEB_URL_PORT: "8080",
    },
  }),
);

const repeatConfirmation = SignupConfirmation.cases.repeat_signup.make({
  user: signupConfirmation.user,
  subjects: signupConfirmation.subjects,
  schedule: signupConfirmation.schedule,
});

describe("signup confirmation email", () => {
  it("decodes both confirmation variants", () => {
    const decode = Schema.decodeUnknownSync(SignupConfirmation);
    const encode = Schema.encodeUnknownSync(SignupConfirmation);

    expect(decode(encode(signupConfirmation))._tag).toBe("first_signup");
    expect(decode(encode(repeatConfirmation))._tag).toBe("repeat_signup");
  });

  it.effect("renders distinct, complete text and HTML receipts", () =>
    Effect.gen(function* () {
      const first = yield* renderSignupConfirmation(signupConfirmation);
      const repeat = yield* renderSignupConfirmation(repeatConfirmation);

      expect(first.subject).toBe("Welcome to dotheyplaytoday");
      expect(first.body.text).toContain("You're on the roster");
      expect(repeat.subject).toBe("Your dotheyplaytoday picks are updated");
      expect(repeat.body.text).toContain("previous picks have been replaced");

      for (const rendered of [first, repeat]) {
        expect(rendered.body.text).toContain("Boston Celtics");
        expect(rendered.body.text).toContain("New York Knicks & Nets <Team>");
        expect(rendered.body.text).toContain("9:00 AM (America/New_York)");
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

  it.effect(
    "sends through the shared client with one generated delivery ID",
    () => {
      const sent: {
        readonly delivery: ChannelDelivery<string>;
        readonly rendered: EmailRendered;
      }[] = [];
      const ClientLayerTest = Layer.succeed(
        EmailChannelClient,
        EmailChannelClient.of({
          send: (delivery, rendered) =>
            Effect.sync(() => sent.push({ delivery, rendered })),
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
      const ChannelLayerTest = SignupConfirmationEmailChannelLayer.pipe(
        Layer.provide(Layer.merge(ClientLayerTest, IdLayerTest)),
      );

      return Effect.gen(function* () {
        const channel = yield* SignupConfirmationChannel;
        yield* channel.deliver(signupConfirmation);

        expect(sent).toHaveLength(1);
        expect(sent[0]?.delivery).toEqual({
          recipient: "fan@example.com",
          hash: "confirmation-delivery-id",
        });
        expect(sent[0]?.rendered.subject).toBe("Welcome to dotheyplaytoday");
      }).pipe(Effect.provide([ChannelLayerTest, WebConfigLayerTest]));
    },
  );

  it.effect("preserves typed provider failures", () => {
    const expected = new ChannelClientResponseError({
      channel: "email",
      message: "Rejected",
      code: "validation_error",
      statusCode: 422,
    });
    const ClientLayerTest = Layer.succeed(
      EmailChannelClient,
      EmailChannelClient.of({ send: () => Effect.fail(expected) }),
    );
    const IdLayerTest = Layer.succeed(
      Id,
      Id.of({
        generate: () => Effect.succeed("confirmation-delivery-id"),
        makeFromBrandedSchema: (schema) =>
          Effect.succeed(schema.make("00000000-0000-4000-8000-000000000999")),
      }),
    );
    const ChannelLayerTest = SignupConfirmationEmailChannelLayer.pipe(
      Layer.provide(Layer.merge(ClientLayerTest, IdLayerTest)),
    );

    return Effect.gen(function* () {
      const channel = yield* SignupConfirmationChannel;
      const error = yield* channel
        .deliver(signupConfirmation)
        .pipe(Effect.flip);

      expect(error).toBe(expected);
    }).pipe(Effect.provide([ChannelLayerTest, WebConfigLayerTest]));
  });
});
