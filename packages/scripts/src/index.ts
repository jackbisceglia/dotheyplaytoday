import { toTimeZone, type TimezoneId } from "@dtpt/core/lib/effect/index";
import { Competitors } from "@dtpt/core/modules/competitor/index";
import {
  Notify,
  type NotificationTemplate,
} from "@dtpt/core/modules/notify/index";
import { Users } from "@dtpt/core/modules/user/index";
import { BunRuntime } from "@effect/platform-bun";
import { Console, DateTime, Effect, Layer, Match } from "effect";

// Helper to compare if two zoned datetimes fall on the same calendar day
const isSameDay = (a: DateTime.Zoned, b: DateTime.Zoned): boolean => {
  const aParts = DateTime.toParts(a);
  const bParts = DateTime.toParts(b);
  return (
    aParts.year === bParts.year &&
    aParts.month === bParts.month &&
    aParts.day === bParts.day
  );
};

// Check if notification should fire based on policy
// Converts UTC dates to user's timezone for proper calendar day comparison
const shouldNotify = (
  policy: "day-start" | "day-prior" | "event-start",
  eventDate: DateTime.Utc,
  now: DateTime.Utc,
  timezone: TimezoneId,
): boolean => {
  const zone = toTimeZone(timezone);
  const eventInUserTz = DateTime.setZone(eventDate, zone);
  const nowInUserTz = DateTime.setZone(now, zone);

  return Match.value(policy).pipe(
    Match.when("event-start", () => false), // UNIMPLEMENTED
    Match.when("day-start", () => {
      // Check if event is today in user's timezone
      return isSameDay(eventInUserTz, nowInUserTz);
    }),
    Match.when("day-prior", () => {
      // Check if event date falls on tomorrow in user's timezone
      const tomorrowInUserTz = DateTime.add(nowInUserTz, { days: 1 });
      return isSameDay(eventInUserTz, tomorrowInUserTz);
    }),
    Match.exhaustive,
  );
};

// Print mock email to terminal
const printMockEmail = (
  userName: string,
  userEmail: string,
  notifications: NotificationTemplate[],
) =>
  Effect.gen(function* () {
    yield* Effect.void;

    const divider = "══════════════════════════════════════════";
    const separator = "──────────────────────────────────────────";

    const header = `
${divider}
Notifications for: ${userName} (${userEmail})
${divider}`;

    const body =
      notifications.length === 0
        ? "\nNo games to notify about today.\n"
        : notifications
            .map(
              (n) => `
Subject: ${n.subject}
Body: ${n.body}`,
            )
            .join(`\n${separator}`);

    yield* Console.log(header + body + `\n${divider}`);
  });

const testRun = Effect.gen(function* () {
  const users = yield* Users;
  const competitors = yield* Competitors;
  const notify = yield* Notify;

  yield* competitors.load();

  const me = yield* users.get();
  const now = yield* DateTime.now;

  const upcoming = yield* Effect.forEach(
    me.preferences,
    Effect.fn(function* (preference) {
      const next = yield* competitors.getNextEvent(preference.competitorId);
      const competitor = yield* competitors.get(next.competitorId);

      return { preference, next, competitor };
    }),
  );

  const upcomingMatchingPolicy = upcoming.filter((item) =>
    shouldNotify(item.preference.policy, item.next.date, now, me.timezone),
  );

  const notifications = yield* Effect.forEach(upcomingMatchingPolicy, (item) =>
    notify.buildTemplate({
      datetime: item.next.date,
      opponent: item.next.opponent,
      teamName: item.competitor.title,
      userTimeZone: me.timezone,
    }),
  );

  yield* printMockEmail(me.name, me.email, notifications);
});

const MainLive = Layer.mergeAll(
  Users.Default,
  Competitors.Default,
  Notify.Default,
);

BunRuntime.runMain(testRun.pipe(Effect.provide(MainLive)));
