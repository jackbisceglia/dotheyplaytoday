import { describe, expect, it } from "@effect/vitest";
import { Cause, ConfigProvider, Effect, Exit, Layer } from "effect";
import type { CreateEmailOptions, CreateEmailResponse } from "resend";
import { beforeEach, vi } from "vitest";

import { Channel } from "../../service.js";
import { EmailChannelLayer, EmailRenderError } from "../service.js";
import { notification } from "../../__tests__/fixtures.js";
import type { Notification } from "../../notification/schema.js";

const resendMock = vi.hoisted(() => ({
  constructor: vi.fn(),
  send: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    readonly emails = {
      send: resendMock.send,
    };

    constructor(apiKey: string) {
      resendMock.constructor(apiKey);
    }
  },
}));

const successResponse: CreateEmailResponse = {
  data: { id: "email-id" },
  error: null,
  headers: null,
};

const EmailConfigLayerTest = ConfigProvider.layer(
  ConfigProvider.fromEnv({
    env: {
      VITE_WEB_URL_BASE: "https://example.com",
      VITE_WEB_URL_PORT: "8080",
      RESEND_API_KEY: "re_test_key",
      RESEND_FROM_EMAIL: "sender@example.com",
    },
  }),
);

const EmailChannelLayerTest = EmailChannelLayer.pipe(
  Layer.provideMerge(EmailConfigLayerTest),
);

const deliver = (input: Notification) =>
  Effect.gen(function* () {
    const channel = yield* Channel;

    yield* channel.deliver(input);
  }).pipe(Effect.provide(EmailChannelLayerTest));

describe("email rendering", () => {
  beforeEach(() => {
    resendMock.constructor.mockReset();
    resendMock.send.mockReset();
    resendMock.send.mockResolvedValue(successResponse);
  });

  it.effect(
    "renders subject-scoped email content with event-centric sections",
    () =>
      Effect.gen(function* () {
        yield* deliver(notification);

        expect(resendMock.send).toHaveBeenCalledOnce();
        const [payload] = resendMock.send.mock.calls[0] as [CreateEmailOptions];

        // Subject and headline use the bare team name; the body keeps the
        // full participant titles.
        expect(payload.subject).toBe("Celtics play today");
        // Start time leads: the subject line already names the team.
        expect(payload.text).toContain(
          "4:00 PM EDT - Boston Celtics vs. New York Knicks",
        );
        expect(payload.text).toContain(
          "8:30 PM EDT - Boston Celtics @ Miami Heat",
        );
        expect(payload.text).toContain(
          "Unsubscribe: https://example.com:8080/unsubscribe/00000000-0000-4000-8000-000000000201",
        );
        expect(payload.html).toContain("Celtics play today");
        expect(payload.html).toContain(
          '<meta name="color-scheme" content="light dark" />',
        );
        expect(payload.html).toContain("@media (prefers-color-scheme: dark)");
        // Phone layout is the inline default; the query only widens it.
        expect(payload.html).toContain("@media screen and (min-width: 600px)");
        // The game count restates the subject line, so it is not rendered.
        expect(payload.html).not.toContain("games on the schedule today");
        expect(payload.text).not.toContain("games on the schedule today");
        expect(payload.html).toContain("Boston Celtics");
        expect(payload.html).toContain("New York Knicks");
        expect(payload.html).toContain("4:00 PM EDT");
        expect(payload.html).toContain("https://example.com:8080/unsubscribe/");
        expect(payload.html).toContain(
          '<a href="https://example.com:8080/unsubscribe/00000000-0000-4000-8000-000000000201"',
        );
      }),
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
        yield* deliver({
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

        expect(resendMock.send).toHaveBeenCalledOnce();
        const [payload] = resendMock.send.mock.calls[0] as [CreateEmailOptions];

        expect(payload.text).toContain(
          "4:00 PM EDT - Knicks & Nets @ Celtics <Home>",
        );
        expect(payload.html).toContain("Knicks &amp; Nets");
        expect(payload.html).toContain("Celtics &lt;Home&gt;");
        expect(payload.html).not.toContain("Knicks & Nets");
        expect(payload.html).not.toContain("Celtics <Home>");
      });
    },
  );

  it.effect(
    "dies with typed render errors for malformed sports game participants",
    () => {
      const [event] = notification.events;
      const [away, home] = event.participants;

      if (!away || !home) {
        throw new Error("Expected fixture event to have away and home teams");
      }

      return Effect.gen(function* () {
        const missingHome = yield* deliver({
          ...notification,
          events: [{ ...event, participants: [away] }],
        }).pipe(Effect.exit);
        const missingAway = yield* deliver({
          ...notification,
          events: [{ ...event, participants: [home] }],
        }).pipe(Effect.exit);

        expect(Exit.isFailure(missingHome)).toBe(true);
        if (Exit.isFailure(missingHome)) {
          const error = Cause.squash(missingHome.cause);

          expect(error).toBeInstanceOf(EmailRenderError);
          if (error instanceof EmailRenderError) {
            expect(error.role).toBe("home");
          }
        }

        expect(Exit.isFailure(missingAway)).toBe(true);
        if (Exit.isFailure(missingAway)) {
          const error = Cause.squash(missingAway.cause);

          expect(error).toBeInstanceOf(EmailRenderError);
          if (error instanceof EmailRenderError) {
            expect(error.role).toBe("away");
          }
        }

        expect(resendMock.send).not.toHaveBeenCalled();
      });
    },
  );
});
