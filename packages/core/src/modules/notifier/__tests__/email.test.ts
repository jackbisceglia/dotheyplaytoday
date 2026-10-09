import { describe, expect, it } from "@effect/vitest";
import { Cause, ConfigProvider, DateTime, Effect, Exit, Layer } from "effect";
import type { CreateEmailOptions, CreateEmailResponse } from "resend";
import { beforeEach, vi } from "vitest";

import { EmailResponseError } from "../../email/errors.js";
import { NotifierLayerEmail, EmailRenderError } from "../email.js";
import { NotifierError } from "../errors.js";
import { nflNotification, notification } from "./fixtures.js";
import type { Notification } from "../notification.js";
import { card, fighterA, all } from "../../mma/__tests__/fixtures.js";
import { Notifier } from "../service.js";

const resendMock = vi.hoisted(() => ({
  constructor: vi.fn(),
  send: vi.fn<(options: CreateEmailOptions) => Promise<CreateEmailResponse>>(),
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
  const payload = resendMock.send.mock.calls[0]?.[0];

  if (!payload) throw new Error("Expected an email send call");

  return payload;
};

describe("email rendering", () => {
  beforeEach(() => {
    resendMock.constructor.mockReset();
    resendMock.send.mockReset();
    resendMock.send.mockResolvedValue(successResponse);
  });

  it.effect(
    "renders fighter and coverage cards with explicit segment times and unknown opponents",
    () =>
      Effect.gen(function* () {
        yield* send({ ...notification, subject: fighterA, events: [card] });
        expect(lastPayload().subject).toBe("Fighter A fights today");
        expect(lastPayload().text).toContain("Starts: 7:00 PM EDT");
        expect(lastPayload().text).toContain(
          "Following Fighter A: Fighter A vs Fighter B (main)",
        );
        expect(lastPayload().text).not.toContain(
          "Individual fight times are not scheduled",
        );
        resendMock.send.mockClear();
        if (card.details._tag !== "mma_card") throw new Error("Expected card");
        yield* send({
          ...notification,
          subject: all,
          events: [
            {
              ...card,
              participants: card.participants.slice(0, 1),
            },
          ],
        });
        expect(lastPayload().subject).toBe("UFC cards today");
        expect(lastPayload().text).toContain("vs Opponent TBD");
        expect(lastPayload().text).toContain("Main card: Oct 3, 10:00 PM EDT");
        expect(lastPayload().text).toContain(
          "Early prelims: Oct 3, 7:00 PM EDT",
        );
      }),
  );

  it.effect(
    "groups UFC participant rows by fight, independent of query order",
    () =>
      Effect.gen(function* () {
        if (card.details._tag !== "mma_card") throw new Error("Expected card");
        yield* send({
          ...notification,
          subject: all,
          events: [
            {
              ...card,
              participants: card.participants
                .map((participant, fightIndex) => ({
                  ...participant,
                  details: {
                    ...participant.details,
                    fightId: `fight-${String(fightIndex + 1)}`,
                  },
                }))
                .toReversed(),
            },
          ],
        });
        expect(lastPayload().text).toContain("Fighter A vs Opponent TBD");
        expect(lastPayload().text).toContain("Fighter B vs Opponent TBD");
        expect(lastPayload().text).not.toContain("Fighter A vs Fighter B");
      }),
  );

  it.effect(
    "rejects mixed feeds and mismatched event tags before sending",
    () =>
      Effect.gen(function* () {
        const invalidFeeds = [
          {
            ...notification,
            subject: all,
            events: [card, ...notification.events],
          },
          {
            ...notification,
            subject: all,
            events: [{ ...card, _tag: "sports_game" }],
          },
          {
            ...notification,
            events: [{ ...notification.events[0], _tag: "mma_card" }],
          },
          {
            ...notification,
            subject: all,
            events: [
              { ...card, participants: notification.events[0].participants },
            ],
          },
          {
            ...notification,
            subject: all,
            events: [
              {
                ...card,
                participants: card.participants.map((participant) => ({
                  ...participant,
                  _tag: "sports_game",
                })),
              },
            ],
          },
        ] satisfies Notification[];
        for (const input of invalidFeeds) {
          expect(Exit.isFailure(yield* Effect.exit(send(input)))).toBe(true);
        }
        expect(resendMock.send).not.toHaveBeenCalled();
      }),
  );

  it.effect(
    "renders subject-scoped email content with event-centric sections",
    () =>
      Effect.gen(function* () {
        yield* send(notification);

        expect(resendMock.send).toHaveBeenCalledOnce();
        const payload = lastPayload();

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
        // The headline is the team's pre-rendered tile, with its text as alt.
        expect(payload.html).toContain(
          'src="https://example.com:8080/email/headlines/celtics-play-today.png"',
        );
        expect(payload.html).toContain('alt="Celtics play today."');
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
        const payload = lastPayload();

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

  it.effect("swaps the team headline for the kickoff tile", () =>
    Effect.gen(function* () {
      yield* send(nflNotification);

      const payload = lastPayload();

      expect(payload.html).toContain(
        'src="https://example.com:8080/email/headlines/football-is-back.png"',
      );
      expect(payload.html).toContain('alt="Football is back."');
      expect(payload.html).not.toContain("eagles-play-today.png");
      expect(payload.subject).toBe("Football's back. Eagles play today.");
      // The matchups remain below the kickoff headline.
      expect(payload.html).toContain("Philadelphia Eagles");
      expect(payload.html).toContain("Dallas Cowboys");
      // The text part carries the same news as the html part.
      expect(payload.text).toContain("Football is back.");
      expect(payload.text).not.toContain("Eagles play today.");
    }),
  );

  it.effect("leaves non-kickoff sends on the team headline", () =>
    Effect.gen(function* () {
      yield* send({
        ...nflNotification,
        sendAt: DateTime.makeUnsafe("2026-09-20T13:00:00.000Z"),
      });

      const payload = lastPayload();

      expect(payload.subject).toBe("Eagles play today");
      expect(payload.html).toContain("/email/headlines/eagles-play-today.png");
      expect(payload.html).not.toContain("football-is-back.png");
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

      expect(payload.html).not.toContain("football-is-back.png");
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

      expect(payload.html).toContain("football-is-back.png");
    }),
  );
});
