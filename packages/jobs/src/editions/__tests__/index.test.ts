import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, DateTime, Effect, Layer } from "effect";

import { ThanksgivingFootball2026 } from "@dtpt/core/modules/editions/catalog";
import type { Edition } from "@dtpt/core/modules/editions/edition";
import {
  fan,
  nflTeam,
  slate,
} from "@dtpt/core/modules/editions/__tests__/fixtures";
import { EmailResponseError } from "@dtpt/core/modules/email/errors";
import { Email } from "@dtpt/core/modules/email/service";
import { Events } from "@dtpt/core/modules/events/service";
import { notification } from "@dtpt/core/modules/notifier/__tests__/fixtures";
import { SubjectId } from "@dtpt/core/modules/subjects/schema";
import { SubscriptionId } from "@dtpt/core/modules/subscriptions/schema";
import {
  NotificationRecipient,
  Subscriptions,
} from "@dtpt/core/modules/subscriptions/service";
import { EmailAddress, UserId } from "@dtpt/core/modules/users/schema";
import { mets } from "@dtpt/core/modules/weekly-digest/__tests__/fixtures";
import { scheduledEditions, sendEdition } from "../index.js";

const edition = ThanksgivingFootball2026;
const inWindow = DateTime.makeUnsafe("2026-11-26T19:00:00Z");

const pick = (
  user: NotificationRecipient["user"],
  subject: NotificationRecipient["subscription"]["subject"],
  index: number,
) =>
  NotificationRecipient.make({
    user,
    subscription: {
      ...notification.subscription,
      id: SubscriptionId.make(
        `00000000-0000-4000-8000-${(960 + index).toString().padStart(12, "0")}`,
      ),
      userId: user.id,
      subject,
      subjectId: subject.id,
    },
  });

const other = {
  ...fan,
  id: UserId.make("00000000-0000-4000-8000-000000000102"),
  email: EmailAddress.make("other@example.com"),
};
const lions = {
  ...nflTeam,
  id: SubjectId.make("00000000-0000-4000-8000-000000000398"),
};

const recipients = [
  pick(fan, nflTeam, 0),
  pick(fan, lions, 1),
  pick(fan, mets, 2),
  pick(other, nflTeam, 3),
  pick(
    {
      ...other,
      id: UserId.make("00000000-0000-4000-8000-000000000103"),
      email: EmailAddress.make("pending@example.com"),
      emailVerified: false,
    },
    lions,
    4,
  ),
  pick(
    {
      ...other,
      id: UserId.make("00000000-0000-4000-8000-000000000104"),
      email: EmailAddress.make("mets@example.com"),
    },
    mets,
    5,
  ),
];

const makeHarness = (
  opts: {
    readonly events?: typeof slate;
    readonly send?: Email["Service"]["send"];
  } = {},
) => {
  const sends: Parameters<Email["Service"]["send"]>[] = [];
  const reads: string[] = [];

  const layer = Layer.mergeAll(
    Layer.succeed(
      Subscriptions,
      Subscriptions.of({
        list: () => Effect.die("unused"),
        listForUser: () => Effect.die("unused"),
        replaceForUser: () => Effect.die("unused"),
        listNotificationRecipients: () =>
          Effect.sync(() => {
            reads.push("recipients");
            return recipients;
          }),
        markSent: () => Effect.die("Editions must not change daily history"),
      }),
    ),
    Layer.succeed(
      Events,
      Events.of({
        get: () => Effect.die("unused"),
        listBySubject: () => Effect.die("unused"),
        listForUser: () => Effect.die("unused"),
        upsert: () => Effect.die("unused"),
        setParticipants: () => Effect.die("unused"),
        listByRange: (range) =>
          Effect.sync(() => {
            reads.push(
              `${DateTime.formatIso(range.from)}/${DateTime.formatIso(range.to)}`,
            );
            return opts.events ?? slate;
          }),
      }),
    ),
    Layer.succeed(
      Email,
      Email.of({
        send: (delivery, rendered) =>
          Effect.gen(function* () {
            sends.push([delivery, rendered]);
            if (opts.send) yield* opts.send(delivery, rendered);
          }),
      }),
    ),
    ConfigProvider.layer(
      ConfigProvider.fromUnknown({ VITE_WEB_URL_BASE: "https://example.com" }),
    ),
  );

  return { sends, reads, layer };
};

describe("edition job", () => {
  it.effect(
    "sends each verified NFL follower one email with the whole slate",
    () =>
      Effect.gen(function* () {
        const harness = makeHarness();

        yield* sendEdition(edition, { now: inWindow, dryRun: false }).pipe(
          Effect.provide(harness.layer),
        );

        expect(harness.reads).toEqual([
          "recipients",
          "2026-11-26T05:00:00.000Z/2026-11-27T05:00:00.000Z",
        ]);
        expect(harness.sends.map(([delivery]) => delivery)).toEqual([
          {
            recipient: fan.email,
            idempotencyKey: `edition:thanksgiving-football-2026:${fan.id}`,
          },
          {
            recipient: other.email,
            idempotencyKey: `edition:thanksgiving-football-2026:${other.id}`,
          },
        ]);
        const text = harness.sends[0]?.[1].body.text ?? "";
        expect(text).toContain("Chicago Bears @ Detroit Lions");
        expect(text).toContain("Philadelphia Eagles @ Dallas Cowboys");
        expect(text).toContain("Kansas City Chiefs @ Buffalo Bills");
        expect(text).not.toContain("Green Bay Packers");
        expect(text).not.toContain("Denver Broncos");
        expect(text).not.toContain("Tulane");
      }),
  );

  it.effect("reuses each recipient's key when rerun", () =>
    Effect.gen(function* () {
      const harness = makeHarness();
      const later = DateTime.makeUnsafe("2026-11-26T20:45:00Z");

      yield* sendEdition(edition, { now: inWindow, dryRun: false }).pipe(
        Effect.provide(harness.layer),
      );
      yield* sendEdition(edition, { now: later, dryRun: false }).pipe(
        Effect.provide(harness.layer),
      );

      expect(harness.sends).toHaveLength(4);
      expect(harness.sends[2]?.[0].idempotencyKey).toBe(
        harness.sends[0]?.[0].idempotencyKey,
      );
    }),
  );

  it.effect("refuses live sends outside the window without reading", () =>
    Effect.gen(function* () {
      for (const now of ["2026-11-26T18:45:00Z", "2026-11-26T21:30:00Z"]) {
        const harness = makeHarness();

        yield* sendEdition(edition, {
          now: DateTime.makeUnsafe(now),
          dryRun: false,
        }).pipe(Effect.provide(harness.layer));

        expect(harness.reads).toEqual([]);
        expect(harness.sends).toEqual([]);
      }
    }),
  );

  it.effect("dry runs render at any time without sending", () =>
    Effect.gen(function* () {
      const harness = makeHarness();

      yield* sendEdition(edition, {
        now: DateTime.makeUnsafe("2026-11-27T12:00:00Z"),
        dryRun: true,
      }).pipe(Effect.provide(harness.layer));

      expect(harness.reads).toHaveLength(2);
      expect(harness.sends).toEqual([]);
    }),
  );

  it.effect("honors the email filter", () =>
    Effect.gen(function* () {
      const harness = makeHarness();

      yield* sendEdition(edition, {
        now: inWindow,
        dryRun: false,
        userEmail: other.email,
      }).pipe(Effect.provide(harness.layer));

      expect(harness.sends.map(([delivery]) => delivery.recipient)).toEqual([
        other.email,
      ]);
    }),
  );

  it.effect("never sends an empty slate", () =>
    Effect.gen(function* () {
      const harness = makeHarness({ events: [] });

      yield* sendEdition(edition, { now: inWindow, dryRun: false }).pipe(
        Effect.provide(harness.layer),
      );

      expect(harness.sends).toEqual([]);
    }),
  );

  it.effect("continues other recipients after a provider rejection", () =>
    Effect.gen(function* () {
      const harness = makeHarness({
        send: (delivery) =>
          delivery.recipient === fan.email
            ? Effect.fail(
                new EmailResponseError({
                  message: "bad recipient",
                  code: "validation_error",
                  statusCode: 422,
                }),
              )
            : Effect.void,
      });

      yield* sendEdition(edition, { now: inWindow, dryRun: false }).pipe(
        Effect.provide(harness.layer),
      );

      expect(harness.sends).toHaveLength(2);
    }),
  );
});

describe("scheduled editions", () => {
  const withCron = (cron: Edition["send"]["cron"]): Edition => ({
    ...edition,
    send: { ...edition.send, cron },
  });

  it.effect("do nothing while the cron is off", () =>
    Effect.gen(function* () {
      const harness = makeHarness();

      yield* scheduledEditions(inWindow).pipe(Effect.provide(harness.layer));
      yield* scheduledEditions(inWindow, [withCron("off")]).pipe(
        Effect.provide(harness.layer),
      );

      expect(harness.reads).toEqual([]);
    }),
  );

  it.effect("run only at the opening tick", () =>
    Effect.gen(function* () {
      const harness = makeHarness();
      const live = [withCron("live")];

      for (const tick of [
        "2026-11-26T18:45:00Z",
        "2026-11-26T19:00:00Z",
        "2026-11-26T19:15:00Z",
        "2026-11-27T19:00:00Z",
      ]) {
        yield* scheduledEditions(DateTime.makeUnsafe(tick), live).pipe(
          Effect.provide(harness.layer),
        );
      }

      expect(harness.sends).toHaveLength(2);
    }),
  );

  it.effect("dry-run mode reads and renders without sending", () =>
    Effect.gen(function* () {
      const harness = makeHarness();

      yield* scheduledEditions(inWindow, [withCron("dry-run")]).pipe(
        Effect.provide(harness.layer),
      );

      expect(harness.reads).toHaveLength(2);
      expect(harness.sends).toEqual([]);
    }),
  );
});
