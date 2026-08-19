import { describe, expect, it } from "@effect/vitest";
import { Cause, Effect, Exit } from "effect";

import { Channel } from "../service.js";
import { EmailRenderError } from "../email/service.js";
import type { EmailRendered } from "../email/render.js";
import type { Notification } from "../notification/schema.js";
import { notification } from "./fixtures.js";

const rendered: EmailRendered = {
  subject: "New York Knicks at Boston Celtics today at 4:00 PM EDT",
  body: {
    text: "email text",
    html: "<p>email html</p>",
  },
};

describe("Channel service", () => {
  it.effect("delivers notifications through the configured channel", () => {
    const renderedNotifications: string[] = [];
    const sentMessages: {
      readonly subscriptionId: string;
      readonly rendered: EmailRendered;
    }[] = [];
    const ChannelLayerTest = Channel.makeLayer(
      Effect.succeed({
        render: (input: Notification) => {
          return Effect.sync(() => {
            renderedNotifications.push(input.subscription.id);

            return rendered;
          });
        },
        send: (input: Notification, message: EmailRendered) =>
          Effect.sync(() => {
            sentMessages.push({
              subscriptionId: input.subscription.id,
              rendered: message,
            });
          }),
      }),
    );

    return Effect.gen(function* () {
      const channel = yield* Channel;

      yield* channel.deliver(notification);

      expect(renderedNotifications).toEqual([notification.subscription.id]);
      expect(sentMessages).toEqual([
        {
          subscriptionId: notification.subscription.id,
          rendered,
        },
      ]);
    }).pipe(Effect.provide(ChannelLayerTest));
  });

  it.effect("dies on render errors instead of sending fallback email", () => {
    const error = new EmailRenderError({
      message: "Expected sports_game event to have participant role",
      eventId: notification.events[0].id,
      role: "home",
    });
    const sentMessages: {
      readonly subscriptionId: string;
      readonly rendered: EmailRendered;
    }[] = [];
    const ChannelLayerTest = Channel.makeLayer(
      Effect.succeed({
        render: () => Effect.fail(error),
        send: (input: Notification, message: EmailRendered) =>
          Effect.sync(() => {
            sentMessages.push({
              subscriptionId: input.subscription.id,
              rendered: message,
            });
          }),
      }),
    );

    return Effect.gen(function* () {
      const channel = yield* Channel;
      const exit = yield* channel.deliver(notification).pipe(Effect.exit);

      expect(Exit.isFailure(exit)).toBe(true);
      if (Exit.isFailure(exit)) {
        expect(Cause.squash(exit.cause)).toBe(error);
      }
      expect(sentMessages).toEqual([]);
    }).pipe(Effect.provide(ChannelLayerTest));
  });
});
