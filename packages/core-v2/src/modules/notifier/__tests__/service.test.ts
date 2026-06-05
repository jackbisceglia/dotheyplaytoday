import { describe, expect, it } from "@effect/vitest";
import { Cause, Effect, Exit, Layer } from "effect";

import { EmailChannel, EmailRenderError } from "../channel/email/service.js";
import type { EmailRendered } from "../channel/email/render.js";
import { Notifier, NotifierLayer } from "../service.js";
import { notification } from "./fixtures.js";

const rendered: EmailRendered = {
  subject: "New York Knicks at Boston Celtics today at 4:00 PM EDT",
  body: {
    text: "email text",
    html: "<p>email html</p>",
  },
};

describe("v2 Notifier service", () => {
  it.effect("delivers notifications through the configured channel", () => {
    const renderedNotifications: string[] = [];
    const sentMessages: {
      readonly to: string;
      readonly rendered: EmailRendered;
    }[] = [];
    const EmailChannelLayerTest = Layer.succeed(
      EmailChannel,
      EmailChannel.of({
        render: (input) => {
          return Effect.sync(() => {
            renderedNotifications.push(input.subscription.id);

            return rendered;
          });
        },
        send: (to, message) =>
          Effect.sync(() => {
            sentMessages.push({ to, rendered: message });
          }),
      }),
    );
    const layer = NotifierLayer.pipe(Layer.provideMerge(EmailChannelLayerTest));

    return Effect.gen(function* () {
      const notifier = yield* Notifier;

      yield* notifier.deliver(notification);

      expect(renderedNotifications).toEqual([notification.subscription.id]);
      expect(sentMessages).toEqual([
        {
          to: notification.user.email,
          rendered,
        },
      ]);
    }).pipe(Effect.provide(layer));
  });

  it.effect("dies on render errors instead of sending fallback email", () => {
    const error = new EmailRenderError({
      message: "Expected sports_game event to have participant role",
      eventId: notification.events[0].id,
      role: "home",
    });
    const sentMessages: {
      readonly to: string;
      readonly rendered: EmailRendered;
    }[] = [];
    const EmailChannelLayerTest = Layer.succeed(
      EmailChannel,
      EmailChannel.of({
        render: () => Effect.fail(error),
        send: (to, message) =>
          Effect.sync(() => {
            sentMessages.push({ to, rendered: message });
          }),
      }),
    );
    const layer = NotifierLayer.pipe(Layer.provideMerge(EmailChannelLayerTest));

    return Effect.gen(function* () {
      const notifier = yield* Notifier;
      const exit = yield* notifier.deliver(notification).pipe(Effect.exit);

      expect(Exit.isFailure(exit)).toBe(true);
      if (Exit.isFailure(exit)) {
        expect(Cause.squash(exit.cause)).toBe(error);
      }
      expect(sentMessages).toEqual([]);
    }).pipe(Effect.provide(layer));
  });
});
