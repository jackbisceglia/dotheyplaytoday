import { describe, expect, it } from "@effect/vitest";
import { DateTime, Schema } from "effect";

import { Subscription } from "../modules/subscriptions/schema";
import {
  getScheduledSend,
  isAlreadySentToday,
  isDue,
  localDateFromUtc,
} from "../modules/subscriptions/time";
import { User } from "../modules/users/schema";

const decode = Schema.decodeUnknownSync;

const sampleIds = {
  userId: "00000000-0000-0000-0000-000000000011",
  subscriptionId: "00000000-0000-0000-0000-000000000012",
  topicId: "00000000-0000-0000-0000-000000000013",
};

const makeUser = (timezone: string) =>
  decode(User)({
    id: sampleIds.userId,
    email: "test@example.com",
    timezone,
  });

const makeSubscription = (sendAtSecondsLocal: number) =>
  decode(Subscription)({
    id: sampleIds.subscriptionId,
    userId: sampleIds.userId,
    topicId: sampleIds.topicId,
    schedule: { type: "fixed", sendAtSecondsLocal },
    enabled: true,
    lastSentAt: null,
  });

const decodeUtc = (value: string) => decode(Schema.DateTimeUtc)(value);

describe("subscription time utilities", () => {
  it("should convert UTC to prior local day when timezone lags UTC", () => {
    const user = makeUser("America/New_York");
    const utc = decodeUtc("2026-02-10T00:30:00Z");

    expect(localDateFromUtc(utc, user.timezone)).toBe("2026-02-09");
  });

  it("should convert fixed local send time to UTC across DST change", () => {
    const user = makeUser("America/New_York");
    const now = decodeUtc("2026-03-08T05:00:00Z");
    const sendAtUtc = DateTime.toUtc(
      getScheduledSend({
        sendAtSecondsLocal: 9 * 3600,
        tz: user.timezone,
        now,
      }),
    );

    expect(DateTime.formatIso(sendAtUtc)).toBe("2026-03-08T13:00:00.000Z");
  });

  it("should return false when current time is more than 60 seconds from scheduled send", () => {
    const user = makeUser("America/New_York");
    const subscription = makeSubscription(3600);
    const onTime = decodeUtc("2026-02-10T06:00:00Z");
    const late = decodeUtc("2026-02-10T06:01:01Z");

    expect(isDue({ subscription, user, now: onTime })).toBe(true);
    expect(isDue({ subscription, user, now: late })).toBe(false);
  });

  it("should convert UTC to next local day when timezone leads UTC", () => {
    const user = makeUser("Asia/Tokyo");
    const utc = decodeUtc("2026-02-10T18:30:00Z");

    expect(localDateFromUtc(utc, user.timezone)).toBe("2026-02-11");
  });

  it("should return false when schedule is relative", () => {
    const user = makeUser("America/New_York");
    const relativeSubscription = decode(Subscription)({
      id: sampleIds.subscriptionId,
      userId: sampleIds.userId,
      topicId: sampleIds.topicId,
      schedule: { type: "relative", timeOffsetSeconds: -1800 },
      enabled: true,
      lastSentAt: null,
    });
    const now = decodeUtc("2026-02-10T06:00:00Z");

    expect(isDue({ subscription: relativeSubscription, user, now })).toBe(
      false,
    );
  });

  it("should compare sent and current local dates for dedupe", () => {
    const user = makeUser("America/New_York");
    const lastSentAt = decodeUtc("2026-02-10T01:00:00Z");
    const sameLocalDate = decodeUtc("2026-02-10T04:00:00Z");
    const nextLocalDate = decodeUtc("2026-02-10T15:00:00Z");

    expect(
      isAlreadySentToday({
        lastSentAt,
        tz: user.timezone,
        now: sameLocalDate,
      }),
    ).toBe(true);
    expect(
      isAlreadySentToday({
        lastSentAt,
        tz: user.timezone,
        now: nextLocalDate,
      }),
    ).toBe(false);
  });

  it("should return false for dedupe when lastSentAt is null", () => {
    const user = makeUser("America/New_York");
    const now = decodeUtc("2026-02-10T04:00:00Z");

    expect(
      isAlreadySentToday({
        lastSentAt: null,
        tz: user.timezone,
        now,
      }),
    ).toBe(false);
  });
});
