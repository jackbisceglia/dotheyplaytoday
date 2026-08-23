import { describe, expect, it } from "@effect/vitest";
import { Cause, Effect, Exit } from "effect";

import type { EmailRendered } from "../../email/render.js";
import { EmailRenderError } from "../email.js";
import type { Notification } from "../notification.js";
import { Notifier } from "../service.js";
import { notification } from "./fixtures.js";

const rendered: EmailRendered = {
  subject: "New York Knicks at Boston Celtics today at 4:00 PM EDT",
  unsubscribeUrl: "https://example.com/unsubscribe/token",
  body: {
    text: "email text",
    html: "<p>email html</p>",
  },
};

describe("Notifier service", () => {
  it.effect("sends notifications through the configured notifier", () => {
    const renderedNotifications: string[] = [];
    const sentMessages: {
      readonly rendered: EmailRendered;
    }[] = [];
    const NotifierLayerTest = Notifier.makeLayer(
      Effect.succeed({
        render: (input: Notification) => {
          return Effect.sync(() => {
            renderedNotifications.push(input.subscription.id);

            return rendered;
          });
        },
        send: (message: EmailRendered) =>
          Effect.sync(() => {
            sentMessages.push({
              rendered: message,
            });
          }),
      }),
    );

    return Effect.gen(function* () {
      const notifier = yield* Notifier;

      yield* notifier.send(notification);

      expect(renderedNotifications).toEqual([notification.subscription.id]);
      expect(sentMessages).toEqual([
        {
          rendered,
        },
      ]);
    }).pipe(Effect.provide(NotifierLayerTest));
  });

  it.effect("dies on render errors instead of sending fallback email", () => {
    const error = new EmailRenderError({
      message: "Expected sports_game event to have participant role",
      eventId: notification.events[0].id,
      role: "home",
    });
    const sentMessages: {
      readonly rendered: EmailRendered;
    }[] = [];
    const NotifierLayerTest = Notifier.makeLayer(
      Effect.succeed({
        render: () => Effect.fail(error),
        send: (message: EmailRendered) =>
          Effect.sync(() => {
            sentMessages.push({
              rendered: message,
            });
          }),
      }),
    );

    return Effect.gen(function* () {
      const notifier = yield* Notifier;
      const exit = yield* notifier.send(notification).pipe(Effect.exit);

      expect(Exit.isFailure(exit)).toBe(true);
      if (Exit.isFailure(exit)) {
        expect(Cause.squash(exit.cause)).toBe(error);
      }
      expect(sentMessages).toEqual([]);
    }).pipe(Effect.provide(NotifierLayerTest));
  });
});
