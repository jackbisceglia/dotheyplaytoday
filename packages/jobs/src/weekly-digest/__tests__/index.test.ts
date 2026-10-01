import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, DateTime, Effect, Layer } from "effect";

import {
  DatabaseReadError,
  DatabaseWriteError,
} from "@dtpt/core/lib/database/errors";
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
import { type WeeklyDigestDelivery } from "@dtpt/core/modules/weekly-digest/delivery-schema";
import { WeeklyDigestDeliveries } from "@dtpt/core/modules/weekly-digest/service";
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
  readonly markSent?: WeeklyDigestDeliveries["Service"]["markSent"];
  readonly readFailure?: boolean;
};
const makeHarness = (opts: HarnessOptions = {}) => {
  const records = new Map<string, WeeklyDigestDelivery>();
  const sends: {
    delivery: Parameters<Email["Service"]["send"]>[0];
    rendered: Parameters<Email["Service"]["send"]>[1];
  }[] = [];
  const queries: {
    subjectId: string;
    options: Parameters<Events["Service"]["listBySubject"]>[1];
  }[] = [];
  const preparations: WeeklyDigestDelivery[] = [];
  const marks: Parameters<WeeklyDigestDeliveries["Service"]["markSent"]>[0][] =
    [];
  const key = (input: Pick<WeeklyDigestDelivery, "userId" | "weekStart">) =>
    `${input.userId}:${input.weekStart}`;
  const state = WeeklyDigestDeliveries.of({
    find: (input) => Effect.sync(() => records.get(key(input))),
    prepare: (input) =>
      Effect.sync(() => {
        preparations.push(input);
        const existing = records.get(key(input));
        if (existing) return existing;
        records.set(key(input), input);
        return input;
      }),
    markSent: (input) =>
      Effect.gen(function* () {
        marks.push(input);
        if (opts.markSent) yield* opts.markSent(input);
        const row = records.get(key(input));
        if (!row)
          return yield* new DatabaseWriteError({ operation: "test.markSent" });
        records.set(key(input), { ...row, sentAt: input.sentAt });
      }),
  });
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
    Layer.succeed(WeeklyDigestDeliveries, state),
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
  return { records, sends, queries, preparations, marks, layer, key };
};

describe("weekly digest orchestration", () => {
  it.effect(
    "sends one email covering all followed teams and marks weekly delivery after success",
    () =>
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
        expect(harness.marks).toEqual([
          { userId: digest.user.id, weekStart: "2026-10-05", sentAt: now },
        ]);
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
      expect(harness.marks).toHaveLength(1);
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
      expect(harness.preparations).toHaveLength(0);
      expect(harness.sends).toHaveLength(0);
    }),
  );

  it.effect("does not query events or write state outside the due window", () =>
    Effect.gen(function* () {
      const harness = makeHarness();
      yield* weeklyDigest({
        now: DateTime.makeUnsafe("2026-10-05T12:45:00Z"),
      }).pipe(Effect.provide(harness.layer));
      expect(harness.queries).toHaveLength(0);
      expect(harness.sends).toHaveLength(0);
      expect(harness.preparations).toHaveLength(0);
    }),
  );

  it.effect("dry runs render without sending or preparing delivery state", () =>
    Effect.gen(function* () {
      const harness = makeHarness();
      yield* weeklyDigest({ now, dryRun: true }).pipe(
        Effect.provide(harness.layer),
      );
      expect(harness.queries).toHaveLength(4);
      expect(harness.sends).toHaveLength(0);
      expect(harness.preparations).toHaveLength(0);
      expect(harness.marks).toHaveLength(0);
    }),
  );

  it.effect(
    "does not resend a completed week, including after a retry tick",
    () =>
      Effect.gen(function* () {
        const harness = makeHarness();
        yield* weeklyDigest({ now }).pipe(Effect.provide(harness.layer));
        yield* weeklyDigest({ now: DateTime.add(now, { minutes: 15 }) }).pipe(
          Effect.provide(harness.layer),
        );
        expect(harness.sends).toHaveLength(1);
        expect(harness.queries).toHaveLength(4);
      }),
  );

  it.effect(
    "reuses the exact persisted message and key after successful send but failed mark-sent",
    () =>
      Effect.gen(function* () {
        let fail = true;
        const harness = makeHarness({
          markSent: () =>
            fail
              ? Effect.fail(
                  new DatabaseWriteError({ operation: "test.markSent" }),
                )
              : Effect.void,
        });
        yield* weeklyDigest({ now }).pipe(Effect.provide(harness.layer));
        expect(harness.marks).toHaveLength(1);
        expect([...harness.records.values()][0]?.sentAt).toBeNull();
        fail = false;
        yield* weeklyDigest({ now: DateTime.add(now, { minutes: 15 }) }).pipe(
          Effect.provide(harness.layer),
        );
        expect(harness.sends).toHaveLength(2);
        expect(harness.sends[1]).toEqual(harness.sends[0]);
        expect(harness.queries).toHaveLength(4);
        expect(harness.preparations).toHaveLength(1);
        expect([...harness.records.values()][0]?.sentAt).not.toBeNull();
      }),
  );

  it.effect(
    "does not mark a provider failure as sent and retries the saved snapshot",
    () =>
      Effect.gen(function* () {
        let fail = true;
        const harness = makeHarness({
          send: () =>
            fail
              ? Effect.fail(
                  new EmailResponseError({
                    message: "temporary failure",
                    code: "internal_server_error",
                    statusCode: 500,
                  }),
                )
              : Effect.void,
        });
        yield* weeklyDigest({ now }).pipe(Effect.provide(harness.layer));
        expect(harness.marks).toHaveLength(0);
        expect([...harness.records.values()][0]?.sentAt).toBeNull();
        fail = false;
        yield* weeklyDigest({ now: DateTime.add(now, { minutes: 15 }) }).pipe(
          Effect.provide(harness.layer),
        );
        expect(harness.sends[1]).toEqual(harness.sends[0]);
        expect(harness.marks).toHaveLength(1);
      }),
  );

  it.effect(
    "does not prepare or send an incomplete digest after an event read failure",
    () =>
      Effect.gen(function* () {
        const harness = makeHarness({ readFailure: true });
        const error = yield* weeklyDigest({ now }).pipe(
          Effect.provide(harness.layer),
          Effect.flip,
        );
        expect(error).toBeInstanceOf(DatabaseReadError);
        expect(harness.sends).toHaveLength(0);
        expect(harness.preparations).toHaveLength(0);
      }),
  );

  it.effect(
    "force can preview the current calendar week outside Monday, still without state writes",
    () =>
      Effect.gen(function* () {
        const harness = makeHarness();
        yield* weeklyDigest({
          now: DateTime.makeUnsafe("2026-10-08T15:00:00Z"),
          force: true,
          dryRun: true,
        }).pipe(Effect.provide(harness.layer));
        expect(harness.queries).toHaveLength(4);
        expect(harness.sends).toHaveLength(0);
        expect(harness.preparations).toHaveLength(0);
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
      expect(harness.marks).toHaveLength(1);
      expect(harness.marks[0]?.userId).toBe(otherRecipient.user.id);
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
      expect(harness.records.size).toBe(2);
    }),
  );
});
