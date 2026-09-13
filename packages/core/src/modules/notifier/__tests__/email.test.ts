import { describe, expect, it } from "@effect/vitest";
import { Cause, ConfigProvider, DateTime, Effect, Exit, Layer } from "effect";
import type { CreateEmailOptions, CreateEmailResponse } from "resend";
import { beforeEach, vi } from "vitest";

import { EmailResponseError } from "../../email/errors.js";
import { NotifierLayerEmail, EmailRenderError } from "../email.js";
import { NotifierError } from "../errors.js";
import { nflNotification, notification } from "./fixtures.js";
import type { Notification } from "../notification.js";
import { Notifier } from "../service.js";

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
      EMAIL_FROM_ADDRESS: "sender@example.com",
    },
  }),
);

const NotifierLayerEmailTest = NotifierLayerEmail.pipe(
  Layer.provideMerge(EmailConfigLayerTest),
);

const send = (input: Notification) =>
  Effect.gen(function* () {
    const notifier = yield* Notifier;

    yield* notifier.send(input);
  }).pipe(Effect.provide(NotifierLayerEmailTest));

const lastPayload = () => {
  const [payload] = resendMock.send.mock.calls[0] as [CreateEmailOptions];

  return payload;
};

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
        yield* send(notification);

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
        yield* send({
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
        const missingHome = yield* send({
          ...notification,
          events: [{ ...event, participants: [away] }],
        }).pipe(Effect.exit);
        const missingAway = yield* send({
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

  it.effect("maps email transport errors to the notifier boundary", () => {
    resendMock.send.mockResolvedValue({
      data: null,
      error: {
        name: "validation_error",
        message: "Invalid recipient",
        statusCode: 422,
      },
      headers: null,
    } satisfies CreateEmailResponse);

    return Effect.gen(function* () {
      const error = yield* send(notification).pipe(Effect.flip);

      expect(error).toBeInstanceOf(NotifierError);
      if (!(error instanceof NotifierError)) {
        return expect.fail(`Expected NotifierError, got ${error._tag}`);
      }
      expect(error.layer).toBe("NotifierLayerEmail");
      expect(error.message).toBe("Invalid recipient");
      expect(error.cause).toBeInstanceOf(EmailResponseError);
    });
  });
});

describe("nfl season opener header", () => {
  beforeEach(() => {
    resendMock.constructor.mockReset();
    resendMock.send.mockReset();
    resendMock.send.mockResolvedValue(successResponse);
  });

  it.effect("replaces the wordmark rule on kickoff day", () =>
    Effect.gen(function* () {
      yield* send(nflNotification);

      const payload = lastPayload();

      expect(payload.html).toContain("Football is");
      expect(payload.html).toContain("back.");
      expect(payload.html).toContain('class="email-hero"');
      // Light hero text is guarded against Gmail's dark-mode inversion.
      expect(payload.html).toContain('class="email-gmail-screen"');
      // The hero carries the wordmark, so the rule header must not also render.
      expect(payload.html).not.toContain("border-bottom: 3px solid");
      // Everything below the header is the ordinary game-day email.
      expect(payload.subject).toBe("Football's back. Eagles play today.");
      expect(payload.html).toContain("Philadelphia Eagles");
      expect(payload.html).toContain("Dallas Cowboys");
      // The text part carries the same news as the html part.
      expect(payload.text).toContain("Football is back.");
    }),
  );

  it.effect("leaves non-kickoff sends on the ordinary header", () =>
    Effect.gen(function* () {
      yield* send({
        ...nflNotification,
        sendAt: DateTime.makeUnsafe("2026-09-20T13:00:00.000Z"),
      });

      const payload = lastPayload();

      expect(payload.subject).toBe("Eagles play today");
      expect(payload.html).not.toContain('class="email-hero"');
      expect(payload.html).not.toContain('class="email-gmail-screen"');
      expect(payload.html).toContain("border-bottom: 3px solid");
      expect(payload.text).not.toContain("Football is back.");
    }),
  );

  it.effect("leaves other leagues alone on kickoff day", () =>
    Effect.gen(function* () {
      yield* send({
        ...notification,
        sendAt: DateTime.makeUnsafe("2026-09-13T13:00:00.000Z"),
      });

      const payload = lastPayload();

      expect(payload.html).not.toContain('class="email-hero"');
      expect(payload.text).not.toContain("Football is back.");
    }),
  );

  it.effect("resolves kickoff day in the recipient's timezone, not utc", () =>
    Effect.gen(function* () {
      // 9:00 PM Sunday in Los Angeles is already Monday in UTC. The reader is
      // still on kickoff Sunday, so the header belongs on this send.
      yield* send({
        ...nflNotification,
        sendAt: DateTime.makeUnsafe("2026-09-14T04:00:00.000Z"),
        user: {
          ...nflNotification.user,
          timezone: DateTime.zoneMakeNamedUnsafe("America/Los_Angeles"),
        },
      });

      const payload = lastPayload();

      expect(payload.html).toContain('class="email-hero"');
    }),
  );
});
