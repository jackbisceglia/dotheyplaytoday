import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, Effect, Layer } from "effect";

import {
  EmailChannel,
  EmailChannelLayer,
  EmailRenderError,
} from "../service.js";
import { notification } from "../../../__tests__/fixtures.js";

const EmailConfigLayerTest = ConfigProvider.layer(
  ConfigProvider.fromEnv({
    env: {
      VITE_WEB_PORT: "8080",
      VITE_WEB_URL: "https://example.com",
      RESEND_API_KEY: "re_test_key",
      RESEND_FROM_EMAIL: "sender@example.com",
    },
  }),
);

const EmailChannelLayerTest = EmailChannelLayer.pipe(
  Layer.provideMerge(EmailConfigLayerTest),
);

describe("v2 email rendering", () => {
  it.effect(
    "renders subject-scoped email content with event-centric sections",
    () =>
      Effect.gen(function* () {
        const channel = yield* EmailChannel;
        const rendered = yield* channel.render(notification);

        expect(rendered.subject).toBe("Boston Celtics play today");
        expect(rendered.body.text).toContain(
          "New York Knicks at Boston Celtics, 4:00 PM EDT",
        );
        expect(rendered.body.text).toContain(
          "Boston Celtics at Miami Heat, 8:30 PM EDT",
        );
        expect(rendered.body.text).toContain(
          "Unsubscribe: https://example.com:8080/unsubscribe/00000000-0000-4000-8000-000000000201",
        );
        expect(rendered.body.html).toContain("Boston Celtics play today");
        expect(rendered.body.html).toContain(
          "New York Knicks at Boston Celtics",
        );
        expect(rendered.body.html).toContain(
          "https://example.com:8080/unsubscribe/",
        );
        expect(rendered.body.html).toContain(
          '<a href="https://example.com:8080/unsubscribe/00000000-0000-4000-8000-000000000201"',
        );
      }).pipe(Effect.provide(EmailChannelLayerTest)),
  );

  it.effect(
    "escapes event titles in html while preserving readable text",
    () => {
      const [event] = notification.events;
      const [away, home] = event.participants;

      if (!away || !home) {
        throw new Error("Expected fixture event to have away and home teams");
      }

      return Effect.gen(function* () {
        const channel = yield* EmailChannel;
        const rendered = yield* channel.render({
          ...notification,
          events: [
            {
              ...event,
              participants: [
                {
                  ...away,
                  details: {
                    ...away.details,
                    title: "Knicks & Nets",
                  },
                },
                {
                  ...home,
                  details: {
                    ...home.details,
                    title: "Celtics <Home>",
                  },
                },
              ],
            },
          ],
        });

        expect(rendered.body.text).toContain(
          "Knicks & Nets at Celtics <Home>, 4:00 PM EDT",
        );
        expect(rendered.body.html).toContain(
          "Knicks &amp; Nets at Celtics &lt;Home&gt;",
        );
      }).pipe(Effect.provide(EmailChannelLayerTest));
    },
  );

  it.effect(
    "returns typed render errors for malformed sports game participants",
    () => {
      const [event] = notification.events;
      const [away, home] = event.participants;

      if (!away || !home) {
        throw new Error("Expected fixture event to have away and home teams");
      }

      return Effect.gen(function* () {
        const channel = yield* EmailChannel;

        const missingHome = yield* channel
          .render({
            ...notification,
            events: [{ ...event, participants: [away] }],
          })
          .pipe(Effect.flip);
        const missingAway = yield* channel
          .render({
            ...notification,
            events: [{ ...event, participants: [home] }],
          })
          .pipe(Effect.flip);

        expect(missingHome).toBeInstanceOf(EmailRenderError);
        expect(missingHome.role).toBe("home");
        expect(missingAway).toBeInstanceOf(EmailRenderError);
        expect(missingAway.role).toBe("away");
      }).pipe(Effect.provide(EmailChannelLayerTest));
    },
  );

});
