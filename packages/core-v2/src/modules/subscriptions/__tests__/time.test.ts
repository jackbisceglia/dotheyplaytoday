import { describe, expect, it } from "@effect/vitest";
import { DateTime, Duration, Schema } from "effect";

import { User } from "../../users/schema.js";
import { Subscription } from "../schema.js";
import { SubscriptionTiming } from "../time.js";

const decode = Schema.decodeUnknownSync;
const utc = decode(Schema.DateTimeUtcFromString);

const due = {
  msLow: Duration.toMillis("1 minute"),
  msHigh: Duration.toMillis("5 minutes"),
};

const userInput = {
  id: "00000000-0000-4000-8000-000000000101",
  email: "test@example.com",
  timezone: "America/New_York",
  unsubscribeToken: "00000000-0000-4000-8000-000000000201",
};

const makeUser = (timezone: string) =>
  decode(User)({
    ...userInput,
    timezone,
  });

const makeSubscription = (sendAtSecondsLocal: number) =>
  decode(Subscription)({
    id: "00000000-0000-4000-8000-000000000401",
    userId: userInput.id,
    subjectId: "00000000-0000-4000-8000-000000000301",
    schedule: {
      _tag: "fixed_local_time",
      sendAtSecondsLocal,
    },
    lastSentAt: null,
  });

describe("subscription time utilities", () => {
  it("converts UTC instants to lagging and leading local dates", () => {
    expect(
      SubscriptionTiming.formatLocalDate(
        utc("2026-02-10T00:30:00.000Z"),
        makeUser("America/New_York").timezone,
      ),
    ).toBe("2026-02-09");
    expect(
      SubscriptionTiming.formatLocalDate(
        utc("2026-02-10T18:30:00.000Z"),
        makeUser("Asia/Tokyo").timezone,
      ),
    ).toBe("2026-02-11");
  });

  it("builds UTC ranges for lagging, leading, and DST-changing local days", () => {
    const lagging = SubscriptionTiming.localDayUtcRange({
      nowUtc: utc("2026-02-10T04:00:00.000Z"),
      timezone: makeUser("America/New_York").timezone,
    });
    const leading = SubscriptionTiming.localDayUtcRange({
      nowUtc: utc("2026-02-10T18:30:00.000Z"),
      timezone: makeUser("Asia/Tokyo").timezone,
    });
    const dstChanging = SubscriptionTiming.localDayUtcRange({
      nowUtc: utc("2026-03-08T12:00:00.000Z"),
      timezone: makeUser("America/New_York").timezone,
    });

    expect(DateTime.formatIso(lagging.from)).toBe(
      "2026-02-09T05:00:00.000Z",
    );
    expect(DateTime.formatIso(lagging.to)).toBe(
      "2026-02-10T05:00:00.000Z",
    );
    expect(DateTime.formatIso(leading.from)).toBe(
      "2026-02-10T15:00:00.000Z",
    );
    expect(DateTime.formatIso(leading.to)).toBe(
      "2026-02-11T15:00:00.000Z",
    );
    expect(DateTime.formatIso(dstChanging.from)).toBe(
      "2026-03-08T05:00:00.000Z",
    );
    expect(DateTime.formatIso(dstChanging.to)).toBe(
      "2026-03-09T04:00:00.000Z",
    );
  });

  it("converts fixed local schedule intent to UTC across DST", () => {
    const user = makeUser("America/New_York");
    const sendAtUtc = SubscriptionTiming.computeScheduleSendAtUtc({
      schedule: makeSubscription(9 * 60 * 60).schedule,
      timezone: user.timezone,
      nowUtc: utc("2026-03-08T05:00:00.000Z"),
    });

    expect(DateTime.formatIso(sendAtUtc)).toBe("2026-03-08T13:00:00.000Z");
  });

  it("checks due windows with one minute early and five minutes late tolerance", () => {
    const user = makeUser("America/New_York");
    const subscription = makeSubscription(9 * 60 * 60);
    const onTime = utc("2026-02-10T14:00:00.000Z");
    const slightlyEarly = DateTime.subtract(onTime, {
      milliseconds: due.msLow - 1000,
    });
    const tooEarly = DateTime.subtract(onTime, {
      milliseconds: due.msLow + 1000,
    });
    const slightlyLate = DateTime.add(onTime, {
      milliseconds: due.msHigh - 1000,
    });
    const tooLate = DateTime.add(onTime, {
      milliseconds: due.msHigh + 1000,
    });

    expect(SubscriptionTiming.isDue({ subscription, user, nowUtc: onTime })).toBe(
      true,
    );
    expect(
      SubscriptionTiming.isDue({ subscription, user, nowUtc: slightlyEarly }),
    ).toBe(true);
    expect(
      SubscriptionTiming.isDue({ subscription, user, nowUtc: tooEarly }),
    ).toBe(false);
    expect(
      SubscriptionTiming.isDue({ subscription, user, nowUtc: slightlyLate }),
    ).toBe(true);
    expect(
      SubscriptionTiming.isDue({ subscription, user, nowUtc: tooLate }),
    ).toBe(false);
  });

  it("compares last sent and current instants by the user's local date", () => {
    const user = makeUser("America/New_York");
    const lastSentAt = utc("2026-02-10T01:00:00.000Z");

    expect(
      SubscriptionTiming.wasSentOnLocalDate({
        lastSentAt,
        timezone: user.timezone,
        nowUtc: utc("2026-02-10T04:00:00.000Z"),
      }),
    ).toBe(true);
    expect(
      SubscriptionTiming.wasSentOnLocalDate({
        lastSentAt,
        timezone: user.timezone,
        nowUtc: utc("2026-02-10T15:00:00.000Z"),
      }),
    ).toBe(false);
    expect(
      SubscriptionTiming.wasSentOnLocalDate({
        lastSentAt: null,
        timezone: user.timezone,
        nowUtc: utc("2026-02-10T04:00:00.000Z"),
      }),
    ).toBe(false);
  });
});
