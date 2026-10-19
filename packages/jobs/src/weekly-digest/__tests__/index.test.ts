import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, DateTime, Effect, Layer } from "effect";

import { DatabaseReadError } from "@dtpt/core/lib/database/errors";
import { Email } from "@dtpt/core/modules/email/service";
import { EmailResponseError } from "@dtpt/core/modules/email/errors";
import { Events } from "@dtpt/core/modules/events/service";
import type { EventWithParticipants } from "@dtpt/core/modules/events/joined";
import {
  all,
  numbered,
  card,
  fighterA,
} from "@dtpt/core/modules/mma/__tests__/fixtures";
import {
  Subscriptions,
  NotificationRecipient,
} from "@dtpt/core/modules/subscriptions/service";
import { SubscriptionId } from "@dtpt/core/modules/subscriptions/schema";
import { UserId, EmailAddress } from "@dtpt/core/modules/users/schema";
import {
  notification,
  fighter,
  ufcCard,
} from "@dtpt/core/modules/notifier/__tests__/fixtures";
import {
  digest,
  college,
  makeGame,
} from "@dtpt/core/modules/weekly-digest/__tests__/fixtures";
import { weeklyDigest } from "../index.js";

const now = DateTime.makeUnsafe("2026-10-05T13:00:00Z");

const recipients = digest.groups.map((team, index) =>
  NotificationRecipient.make({
    user: digest.user,
    subscription: {
      ...notification.subscription,
      id: SubscriptionId.make(
        `00000000-0000-4000-8000-${(410 + index).toString().padStart(12, "0")}`,
      ),
      subject: team.subject,
      subjectId: team.subject.id,
    },
  }),
);

const otherRecipient = NotificationRecipient.make({
  user: {
    ...digest.user,
    id: UserId.make("00000000-0000-4000-8000-000000000102"),
    email: EmailAddress.make("other@example.com"),
  },
  subscription: {
    ...notification.subscription,
    id: SubscriptionId.make("00000000-0000-4000-8000-000000000420"),
    subject: digest.groups[0].subject,
    subjectId: digest.groups[0].subject.id,
    userId: UserId.make("00000000-0000-4000-8000-000000000102"),
  },
});

const coverageRecipient = NotificationRecipient.make({
  ...otherRecipient,
  subscription: {
    ...otherRecipient.subscription,
    id: SubscriptionId.make("00000000-0000-4000-8000-000000000425"),
    subject: all,
    subjectId: all.id,
  },
});

type HarnessOptions = {
  readonly recipients?: readonly NotificationRecipient[];
  readonly quiet?: boolean;
  readonly send?: Email["Service"]["send"];
  readonly readFailure?: boolean;
  readonly events?: readonly EventWithParticipants[];
};

const makeHarness = (opts: HarnessOptions = {}) => {
  const sends: {
    delivery: Parameters<Email["Service"]["send"]>[0];
    rendered: Parameters<Email["Service"]["send"]>[1];
  }[] = [];
  const queries: {
    subjectId: string;
    options: Parameters<Events["Service"]["listBySubject"]>[1];
  }[] = [];

  const layer = Layer.mergeAll(
    Layer.succeed(
      Subscriptions,
      Subscriptions.of({
        list: () => Effect.die("unused"),
        listForUser: () => Effect.die("unused"),
        replaceForUser: () => Effect.die("unused"),
        listNotificationRecipients: () =>
          Effect.succeed(opts.recipients ?? recipients),
        markSent: () =>
          Effect.die("Weekly digest must not change daily history"),
      }),
    ),
    Layer.succeed(
      Events,
      Events.of({
        get: () => Effect.die("unused"),
        listForUser: () => Effect.die("unused"),
        upsert: () => Effect.die("unused"),
        setParticipants: () => Effect.die("unused"),
        listBySubject: (subjectId, options) =>
          Effect.gen(function* () {
            queries.push({ subjectId, options });

            if (opts.readFailure)
              return yield* new DatabaseReadError({
                operation: "test.listBySubject",
              });

            if (opts.events) return opts.events;

            return opts.quiet
              ? []
              : (digest.groups.find((team) => team.subject.id === subjectId)
                  ?.events ?? []);
          }),
      }),
    ),
    Layer.succeed(
      Email,
      Email.of({
        send: (delivery, rendered) =>
          Effect.gen(function* () {
            sends.push({ delivery, rendered });
            if (opts.send) yield* opts.send(delivery, rendered);
          }),
      }),
    ),
    ConfigProvider.layer(
      ConfigProvider.fromUnknown({ VITE_WEB_URL_BASE: "https://example.com" }),
    ),
  );

  return { sends, queries, layer };
};

describe("weekly digest orchestration", () => {
  it.effect(
    "includes teams, fighters, and card coverage on mixed rosters",
    () =>
      Effect.gen(function* () {
        const followedFighter = fighter("Test Fighter");
        const fighterPick = {
          ...otherRecipient,
          subscription: {
            ...otherRecipient.subscription,
            subject: followedFighter,
            subjectId: followedFighter.id,
          },
        };

        const collegePick = {
          ...otherRecipient,
          subscription: {
            ...otherRecipient.subscription,
            subject: college,
            subjectId: college.id,
          },
        };

        const mixed = makeHarness({
          recipients: [
            otherRecipient,
            collegePick,
            coverageRecipient,
            fighterPick,
          ],
          quiet: true,
        });

        yield* weeklyDigest({ now }).pipe(Effect.provide(mixed.layer));

        expect(mixed.sends).toHaveLength(1);
        expect(mixed.queries.map((query) => query.subjectId)).toEqual([
          otherRecipient.subscription.subjectId,
          college.id,
          all.id,
          followedFighter.id,
        ]);
        expect(mixed.sends[0]?.rendered.body.text).toContain(
          college.details.display,
        );
        expect(mixed.sends[0]?.rendered.body.text).toContain("UFC Events");
        expect(mixed.sends[0]?.rendered.body.text).toContain("Test Fighter");
      }),
  );

  it.effect(
    "sends fighter-only and coverage-only users their UFC cards, including quiet weeks",
    () =>
      Effect.gen(function* () {
        for (const subject of [all, numbered, fighterA]) {
          const recipient = {
            ...coverageRecipient,
            subscription: {
              ...coverageRecipient.subscription,
              subject,
              subjectId: subject.id,
            },
          };
          const harness = makeHarness({
            recipients: [recipient],
            events: [card],
          });

          yield* weeklyDigest({ now }).pipe(Effect.provide(harness.layer));

          expect(harness.sends).toHaveLength(1);
          expect(harness.sends[0]?.rendered.body.text).toContain("UFC test");
          expect(harness.sends[0]?.rendered.body.text).toContain("Main Card");
          expect(harness.sends[0]?.delivery.idempotencyKey).toBe(
            `weekly-digest:${recipient.user.id}:2026-10-05`,
          );

          const quiet = makeHarness({ recipients: [recipient], quiet: true });

          yield* weeklyDigest({ now }).pipe(Effect.provide(quiet.layer));

          expect(quiet.sends).toHaveLength(1);
          expect(quiet.sends[0]?.rendered.body.text).toContain(
            "No events this week.",
          );
        }
      }),
  );

  it.effect(
    "keeps unverified card subscribers ineligible and card dry runs send-free",
    () =>
      Effect.gen(function* () {
        const pending = makeHarness({
          recipients: [
            {
              ...coverageRecipient,
              user: { ...coverageRecipient.user, emailVerified: false },
            },
          ],
          events: [card],
        });

        yield* weeklyDigest({ now, force: true }).pipe(
          Effect.provide(pending.layer),
        );

        expect(pending.queries).toHaveLength(0);
        expect(pending.sends).toHaveLength(0);

        const preview = makeHarness({
          recipients: [coverageRecipient],
          events: [card],
        });

        yield* weeklyDigest({ now, dryRun: true }).pipe(
          Effect.provide(preview.layer),
        );

        expect(preview.queries).toHaveLength(1);
        expect(preview.sends).toHaveLength(0);
      }),
  );

  it.effect("sends NCAA-only users their team games", () =>
    Effect.gen(function* () {
      const recipient = {
        ...otherRecipient,
        subscription: {
          ...otherRecipient.subscription,
          subject: college,
          subjectId: college.id,
        },
      };
      const harness = makeHarness({
        recipients: [recipient],
        events: [
          makeGame(college, "Test Opponent", "2026-10-07T23:00:00Z", 732),
        ],
      });

      yield* weeklyDigest({ now }).pipe(Effect.provide(harness.layer));

      expect(harness.sends).toHaveLength(1);
      expect(harness.sends[0]?.rendered.body.text).toContain(
        college.details.display,
      );
      expect(harness.sends[0]?.rendered.body.text).toContain(
        "New York College vs Test Opponent",
      );
    }),
  );

  it.effect(
    "logs a malformed event without sending an incomplete digest or aborting other users",
    () =>
      Effect.gen(function* () {
        const harness = makeHarness({
          recipients: [...recipients, otherRecipient],
          events: [ufcCard()],
        });

        yield* weeklyDigest({ now }).pipe(Effect.provide(harness.layer));

        expect(harness.queries).toHaveLength(5);
        expect(harness.sends).toHaveLength(0);
      }),
  );

  it.effect(
    "continues team recipients after a malformed UFC coverage group",
    () =>
      Effect.gen(function* () {
        const harness = makeHarness({
          recipients: [coverageRecipient, ...recipients.slice(0, 1)],
          events: digest.groups[0].events,
        });

        yield* weeklyDigest({ now }).pipe(Effect.provide(harness.layer));

        expect(harness.sends).toHaveLength(1);
        expect(harness.sends[0]?.delivery.recipient).toBe(digest.user.email);
      }),
  );

  it.effect(
    "sends in one batch regardless of daily time preferences or recipient timezone",
    () =>
      Effect.gen(function* () {
        const other = {
          ...otherRecipient,
          user: {
            ...otherRecipient.user,
            timezone: DateTime.zoneMakeNamedUnsafe("Pacific/Honolulu"),
          },
          subscription: {
            ...otherRecipient.subscription,
            lastSentAt: now,
            schedule: {
              ...otherRecipient.subscription.schedule,
              sendAtSecondsLocal: 20 * 3600,
            },
          },
        };
        const harness = makeHarness({
          recipients: [...recipients, other],
          quiet: true,
        });

        yield* weeklyDigest({
          now: DateTime.makeUnsafe("2026-10-05T09:00:00Z"),
        }).pipe(Effect.provide(harness.layer));

        expect(harness.sends.map((send) => send.delivery.recipient)).toEqual([
          digest.user.email,
          other.user.email,
        ]);
        expect(harness.sends[1]?.delivery.idempotencyKey).toBe(
          `weekly-digest:${other.user.id}:2026-10-05`,
        );
        expect(
          DateTime.formatIso(
            harness.queries.at(-1)?.options?.range?.from ?? now,
          ),
        ).toBe("2026-10-05T10:00:00.000Z");
      }),
  );

  it.effect("sends one personalized email covering all followed teams", () =>
    Effect.gen(function* () {
      const harness = makeHarness();

      yield* weeklyDigest({ now }).pipe(Effect.provide(harness.layer));

      expect(harness.sends).toHaveLength(1);
      expect(harness.sends[0]?.rendered.body.text).toContain("New York Mets");
      expect(harness.queries).toHaveLength(4);
      for (const query of harness.queries) {
        expect(DateTime.formatIso(query.options?.range?.from ?? now)).toBe(
          "2026-10-05T04:00:00.000Z",
        );
        expect(DateTime.formatIso(query.options?.range?.to ?? now)).toBe(
          "2026-10-12T04:00:00.000Z",
        );
        expect(query.options?.availability).toBeUndefined(); // Existing query defaults to active games.
      }
      expect(harness.sends[0]?.delivery.idempotencyKey).toBe(
        `weekly-digest:${digest.user.id}:2026-10-05`,
      );
    }),
  );

  it.effect("sends a quiet-week email with every followed team", () =>
    Effect.gen(function* () {
      const harness = makeHarness({ quiet: true });
      yield* weeklyDigest({ now }).pipe(Effect.provide(harness.layer));

      expect(harness.sends).toHaveLength(1);
      expect(harness.sends[0]?.rendered.body.text).toContain(
        "No events this week.",
      );
    }),
  );

  it.effect("skips ineligible users even during forced dry runs", () =>
    Effect.gen(function* () {
      const harness = makeHarness({
        recipients: recipients.map((recipient) => ({
          ...recipient,
          user: { ...recipient.user, emailVerified: false },
        })),
      });

      yield* weeklyDigest({ now, force: true, dryRun: true }).pipe(
        Effect.provide(harness.layer),
      );
      expect(harness.queries).toHaveLength(0);
      expect(harness.sends).toHaveLength(0);
    }),
  );

  it.effect("dry runs render without sending", () =>
    Effect.gen(function* () {
      const harness = makeHarness();

      yield* weeklyDigest({ now, dryRun: true }).pipe(
        Effect.provide(harness.layer),
      );
      expect(harness.queries).toHaveLength(4);
      expect(harness.sends).toHaveLength(0);
    }),
  );

  it.effect(
    "uses the same provider key when rerunning the same weekly batch",
    () =>
      Effect.gen(function* () {
        const harness = makeHarness();
        yield* weeklyDigest({ now }).pipe(Effect.provide(harness.layer));
        yield* weeklyDigest({ now }).pipe(Effect.provide(harness.layer));

        expect(harness.sends).toHaveLength(2);
        expect(harness.sends[1]?.delivery.idempotencyKey).toBe(
          harness.sends[0]?.delivery.idempotencyKey,
        );
      }),
  );

  it.effect(
    "does not send an incomplete digest after an event read failure",
    () =>
      Effect.gen(function* () {
        const harness = makeHarness({ readFailure: true });
        const error = yield* weeklyDigest({ now }).pipe(
          Effect.provide(harness.layer),
          Effect.flip,
        );
        expect(error).toBeInstanceOf(DatabaseReadError);
        expect(harness.sends).toHaveLength(0);
      }),
  );

  it.effect(
    "manual runs can preview the current calendar week outside Monday",
    () =>
      Effect.gen(function* () {
        const harness = makeHarness();
        yield* weeklyDigest({
          now: DateTime.makeUnsafe("2026-10-08T15:00:00Z"),
          dryRun: true,
        }).pipe(Effect.provide(harness.layer));

        expect(harness.queries).toHaveLength(4);
        expect(harness.sends).toHaveLength(0);
      }),
  );

  it.effect("honors the email filter", () =>
    Effect.gen(function* () {
      const harness = makeHarness({
        recipients: [...recipients, otherRecipient],
      });

      yield* weeklyDigest({ now, userEmail: notification.user.email }).pipe(
        Effect.provide(harness.layer),
      );
      expect(harness.sends).toHaveLength(1);
      expect(harness.sends[0]?.delivery.recipient).toBe(
        notification.user.email,
      );
    }),
  );

  it.effect("continues other users after a provider failure", () =>
    Effect.gen(function* () {
      const harness = makeHarness({
        recipients: [...recipients, otherRecipient],
        send: (delivery) =>
          delivery.recipient === digest.user.email
            ? Effect.fail(
                new EmailResponseError({
                  message: "bad recipient",
                  code: "validation_error",
                  statusCode: 422,
                }),
              )
            : Effect.void,
      });

      yield* weeklyDigest({ now }).pipe(Effect.provide(harness.layer));

      expect(harness.sends).toHaveLength(2);
    }),
  );

  it.effect("starts a fresh delivery for the next local week", () =>
    Effect.gen(function* () {
      const harness = makeHarness({ quiet: true });
      yield* weeklyDigest({ now }).pipe(Effect.provide(harness.layer));
      yield* weeklyDigest({
        now: DateTime.makeUnsafe("2026-10-12T13:00:00Z"),
      }).pipe(Effect.provide(harness.layer));

      expect(harness.sends).toHaveLength(2);
      expect(harness.sends[1]?.delivery.idempotencyKey).toBe(
        `weekly-digest:${digest.user.id}:2026-10-12`,
      );
    }),
  );
});
