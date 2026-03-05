// AI Gen'd, minorly reviewed for code quality
import { describe, expect, it } from "@effect/vitest";
import { Subscription } from "@dtpt/core/modules/subscriptions/schema";
import { User } from "@dtpt/core/modules/users/schema";
import { Schema } from "effect";

import {
  applyUserFilter,
  buildInspectRows,
  sortInspectRows,
  type InspectRow,
} from "./inspect.js";

const sampleIds = {
  userA: "00000000-0000-0000-0000-000000000301",
  userB: "00000000-0000-0000-0000-000000000302",
  topicA: "00000000-0000-0000-0000-000000000303",
  topicB: "00000000-0000-0000-0000-000000000304",
  subscriptionA: "00000000-0000-0000-0000-000000000305",
  subscriptionB: "00000000-0000-0000-0000-000000000306",
};

type MakeUserOptions = {
  id?: string;
  email?: string;
  timezone?: string;
};

type MakeFixedSubscriptionOptions = {
  id?: string;
  userId?: string;
  topicId?: string;
  sendAtSecondsLocal?: number;
  enabled?: boolean;
  lastSentAt?: string | null;
};

type MakeRelativeSubscriptionOptions = {
  id?: string;
  userId?: string;
  topicId?: string;
  enabled?: boolean;
  lastSentAt?: string | null;
};

const makeUser = (opts: MakeUserOptions = {}) =>
  Schema.decodeUnknownSync(User)({
    id: opts.id ?? sampleIds.userA,
    email: opts.email ?? "fan@example.com",
    timezone: opts.timezone ?? "America/New_York",
  });

const makeFixedSubscription = (opts: MakeFixedSubscriptionOptions = {}) =>
  Schema.decodeUnknownSync(Subscription)({
    id: opts.id ?? sampleIds.subscriptionA,
    userId: opts.userId ?? sampleIds.userA,
    topicId: opts.topicId ?? sampleIds.topicA,
    schedule: {
      type: "fixed",
      sendAtSecondsLocal: opts.sendAtSecondsLocal ?? 13 * 3600,
    },
    enabled: opts.enabled ?? true,
    lastSentAt: opts.lastSentAt ?? null,
  });

const makeRelativeSubscription = (opts: MakeRelativeSubscriptionOptions = {}) =>
  Schema.decodeUnknownSync(Subscription)({
    id: opts.id ?? sampleIds.subscriptionA,
    userId: opts.userId ?? sampleIds.userA,
    topicId: opts.topicId ?? sampleIds.topicA,
    schedule: {
      type: "relative",
      timeOffsetSeconds: -1800,
    },
    enabled: opts.enabled ?? true,
    lastSentAt: opts.lastSentAt ?? null,
  });

const baseInspectUser = makeUser();
const baseInspectSubscription = makeFixedSubscription();
const inspectNow = Schema.decodeUnknownSync(Schema.DateTimeUtc)(
  "2026-02-10T14:00:00Z",
);

const makeRow = (overrides: Partial<InspectRow>): InspectRow => ({
  subscriptionId: baseInspectSubscription.id,
  userId: baseInspectSubscription.userId,
  email: baseInspectUser.email,
  timezone: "America/New_York",
  topicId: baseInspectSubscription.topicId,
  teamName: "Boston Celtics",
  schedule: "fixed(09:00)",
  sendAtLocal: "9:00 AM EST",
  enabled: true,
  lastSentAt: null,
  ...overrides,
});

describe("inspect", () => {
  it("builds joined rows with fixed schedule formatting", () => {
    const user = makeUser();
    const subscription = makeFixedSubscription({
      lastSentAt: "2026-03-03T13:58:07.169Z",
    });

    const rows = buildInspectRows({
      users: [user],
      subscriptions: [subscription],
      teamByTopicId: new Map([[subscription.topicId, "Boston Celtics"]]),
      now: inspectNow,
    });

    expect(rows).toHaveLength(1);
    const [row] = rows;
    expect(row).toBeDefined();
    if (!row) return;

    expect(row.email).toBe("fan@example.com");
    expect(row.userId).toBe(sampleIds.userA);
    expect(row.teamName).toBe("Boston Celtics");
    expect(row.timezone).toBe("America/New_York");
    expect(row.schedule).toBe("fixed(13:00)");
    expect(row.sendAtLocal).toMatch(/\s?1:00\sPM\s\S+/);
    expect(row.enabled).toBe(true);
    expect(row.lastSentAt).toBe("2026-03-03T13:58:07.169Z");
  });

  it("uses placeholders for missing joins and relative schedules", () => {
    const subscription = makeRelativeSubscription();

    const rows = buildInspectRows({
      users: [],
      subscriptions: [subscription],
      teamByTopicId: new Map(),
      now: inspectNow,
    });

    expect(rows).toHaveLength(1);
    const [row] = rows;
    expect(row).toBeDefined();
    if (!row) return;

    expect(row.email).toBe("(unknown user)");
    expect(row.teamName).toBe("(unknown topic)");
    expect(row.timezone).toBe("-");
    expect(row.schedule).toBe("relative(-1800)");
    expect(row.sendAtLocal).toBe("-");
    expect(row.lastSentAt).toBeNull();
  });

  it("filters by user id or email", () => {
    const userA = makeUser();
    const userB = makeUser({
      id: sampleIds.userB,
      email: "second@example.com",
    });
    const subscriptionA = makeFixedSubscription();
    const subscriptionB = makeFixedSubscription({
      id: sampleIds.subscriptionB,
      userId: sampleIds.userB,
      topicId: sampleIds.topicB,
    });

    const rows = buildInspectRows({
      users: [userA, userB],
      subscriptions: [subscriptionA, subscriptionB],
      teamByTopicId: new Map([
        [subscriptionA.topicId, "Boston Celtics"],
        [subscriptionB.topicId, "New York Knicks"],
      ]),
      now: inspectNow,
    });

    expect(applyUserFilter(rows, sampleIds.userA)).toHaveLength(1);
    expect(applyUserFilter(rows, "fan@example.com")).toHaveLength(1);
    expect(applyUserFilter(rows, "FAN@EXAMPLE.COM")).toHaveLength(0);
    expect(applyUserFilter(rows, "   ")).toHaveLength(0);
  });

  it("sorts by email, fixed schedule time, then teamName", () => {
    const rows = sortInspectRows([
      makeRow({
        email: "b@example.com",
        schedule: "fixed(09:00)",
        sendAtLocal: "9:00 AM EST",
        teamName: "Boston Celtics",
      }),
      makeRow({
        email: "a@example.com",
        schedule: "fixed(10:00)",
        sendAtLocal: "10:00 AM EST",
        teamName: "Chicago Bulls",
      }),
      makeRow({
        email: "a@example.com",
        schedule: "fixed(09:00)",
        sendAtLocal: "9:00 AM EST",
        teamName: "Miami Heat",
      }),
      makeRow({
        email: "a@example.com",
        schedule: "fixed(09:00)",
        sendAtLocal: "9:00 AM EST",
        teamName: "Atlanta Hawks",
      }),
      makeRow({
        email: "a@example.com",
        schedule: "relative(-1800)",
        sendAtLocal: "-",
        teamName: "Denver Nuggets",
      }),
    ]);

    expect(
      rows.map((row) => `${row.email}|${row.schedule}|${row.teamName}`),
    ).toEqual([
      "a@example.com|fixed(09:00)|Atlanta Hawks",
      "a@example.com|fixed(09:00)|Miami Heat",
      "a@example.com|fixed(10:00)|Chicago Bulls",
      "a@example.com|relative(-1800)|Denver Nuggets",
      "b@example.com|fixed(09:00)|Boston Celtics",
    ]);
  });
});
