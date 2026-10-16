import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, DateTime, Effect, Layer } from "effect";

import { DatabaseReadError } from "@dtpt/core/lib/database/errors";
import { Email } from "@dtpt/core/modules/email/service";
import { EmailResponseError } from "@dtpt/core/modules/email/errors";
import { Events } from "@dtpt/core/modules/events/service";
import {
  Subscriptions,
  NotificationRecipient,
} from "@dtpt/core/modules/subscriptions/service";
import { SubscriptionId } from "@dtpt/core/modules/subscriptions/schema";
import { UserId, EmailAddress } from "@dtpt/core/modules/users/schema";
import { notification } from "@dtpt/core/modules/notifier/__tests__/fixtures";
import { digest } from "@dtpt/core/modules/weekly-digest/__tests__/fixtures";
import { weeklyDigest } from "../index.js";

const now = DateTime.makeUnsafe("2026-10-05T13:00:00Z");
const recipients = digest.teams.map((team, index) =>
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
    subject: digest.teams[0].subject,
    subjectId: digest.teams[0].subject.id,
    userId: UserId.make("00000000-0000-4000-8000-000000000102"),
  },
});

type HarnessOptions = {
  readonly recipients?: readonly NotificationRecipient[];
  readonly quiet?: boolean;
  readonly send?: Email["Service"]["send"];
  readonly readFailure?: boolean;
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
        upsert: () => Effect.die("unused"),
        setParticipants: () => Effect.die("unused"),
        listBySubject: (subjectId, options) =>
          Effect.gen(function* () {
            queries.push({ subjectId, options });
            if (opts.readFailure)
              return yield* new DatabaseReadError({
                operation: "test.listBySubject",
              });
            return opts.quiet
              ? []
              : (digest.teams.find((team) => team.subject.id === subjectId)
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
        "No games this week.",
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
