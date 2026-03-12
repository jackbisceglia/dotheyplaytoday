import { describe, expect, it } from "@effect/vitest";
import { DateTime, Schema } from "effect";

import { Delivery } from "../modules/subscriptions/delivery.js";
import { Subscription } from "../modules/subscriptions/schema.js";
import { User } from "../modules/users/schema.js";

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

describe("subscription schedule", () => {
  it("should convert fixed local send time to UTC across DST change", () => {
    const user = makeUser("America/New_York");
    const now = decodeUtc("2026-03-08T05:00:00Z");
    const sendAtUtc = DateTime.toUtc(
      Delivery.getScheduledSend({
        sendAtSecondsLocal: 9 * 3600,
        timezone: user.timezone,
        now,
      }),
    );

    expect(DateTime.formatIso(sendAtUtc)).toBe("2026-03-08T13:00:00.000Z");
  });

  it("should allow a small early window before scheduled send", () => {
    const user = makeUser("America/New_York");
    const subscription = makeSubscription(3600);
    const onTime = decodeUtc("2026-02-10T06:00:00Z");
    const slightlyEarly = DateTime.mapEpochMillis(
      onTime,
      (ms) => ms - (Delivery.constants.tolerance.earlyMs - 1000),
    );
    const tooEarly = DateTime.mapEpochMillis(
      onTime,
      (ms) => ms - (Delivery.constants.tolerance.earlyMs + 1000),
    );

    expect(Delivery.isDue({ subscription, user, now: onTime })).toBe(true);
    expect(Delivery.isDue({ subscription, user, now: slightlyEarly })).toBe(
      true,
    );
    expect(Delivery.isDue({ subscription, user, now: tooEarly })).toBe(false);
  });

  it("should allow a broader late window after scheduled send", () => {
    const user = makeUser("America/New_York");
    const subscription = makeSubscription(3600);
    const onTime = decodeUtc("2026-02-10T06:00:00Z");
    const slightlyLate = DateTime.mapEpochMillis(
      onTime,
      (ms) => ms + (Delivery.constants.tolerance.lateMs - 1000),
    );
    const tooLate = DateTime.mapEpochMillis(
      onTime,
      (ms) => ms + (Delivery.constants.tolerance.lateMs + 1000),
    );

    expect(Delivery.isDue({ subscription, user, now: onTime })).toBe(true);
    expect(Delivery.isDue({ subscription, user, now: slightlyLate })).toBe(
      true,
    );
    expect(Delivery.isDue({ subscription, user, now: tooLate })).toBe(false);
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

    expect(
      Delivery.isDue({
        subscription: relativeSubscription,
        user,
        now,
      }),
    ).toBe(false);
  });
});
