import { describe, expect, it } from "@effect/vitest";
import { Schema } from "effect";

import { Subscription, SubscriptionInsert } from "../schema.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;

const subscriptionInput = {
  id: "00000000-0000-4000-8000-000000000401",
  userId: "00000000-0000-4000-8000-000000000101",
  subjectId: "00000000-0000-4000-8000-000000000301",
  schedule: {
    _tag: "fixed_local_time",
    sendAtSecondsLocal: 9 * 60 * 60,
  },
  lastSentAt: "2026-05-24T13:00:00.000Z",
};

describe("Subscription model", () => {
  it("rejects malformed subscription-owned fields and schedules", () => {
    expect(() =>
      decode(Subscription)({ ...subscriptionInput, id: "not-uuid" }),
    ).toThrow();
    expect(() =>
      decode(Subscription)({
        ...subscriptionInput,
        schedule: { _tag: "relative", timeOffsetSeconds: -1800 },
      }),
    ).toThrow();
    expect(() =>
      decode(Subscription)({
        ...subscriptionInput,
        schedule: {
          _tag: "fixed_local_time",
          sendAtSecondsLocal: 9 * 60 * 60 + 1,
        },
      }),
    ).toThrow();
    expect(() =>
      decode(Subscription)({
        ...subscriptionInput,
        schedule: {
          _tag: "fixed_local_time",
          sendAtSecondsLocal: 24 * 60 * 60,
        },
      }),
    ).toThrow();
    expect(() =>
      decode(Subscription)({ ...subscriptionInput, lastSentAt: "not-a-date" }),
    ).toThrow();
  });

  it("encodes and decodes the subscription row boundary", () => {
    const subscription = decode(Subscription)(subscriptionInput);
    const insert = encode(SubscriptionInsert)(subscription);
    const selected = decode(Subscription)(insert);

    expect(insert).toEqual(subscriptionInput);
    expect(selected.id).toBe(subscription.id);
    expect(selected.schedule).toEqual(subscription.schedule);
    expect(encode(Subscription)(selected)).toEqual(subscriptionInput);
  });
});
