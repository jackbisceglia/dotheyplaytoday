import { describe, expect, it } from "@effect/vitest";
import { Schema } from "effect";

import { isSameLocalDate, localDateFromUtc } from "../lib/datetime.js";
import { User } from "../modules/users/schema.js";

const decode = Schema.decodeUnknownSync;

const sampleIds = {
  userId: "00000000-0000-0000-0000-000000000011",
};

const makeUser = (timezone: string) =>
  decode(User)({
    id: sampleIds.userId,
    email: "test@example.com",
    timezone,
  });

const decodeUtc = (value: string) => decode(Schema.DateTimeUtc)(value);

describe("datetime utilities", () => {
  it("should convert UTC to prior local day when timezone lags UTC", () => {
    const user = makeUser("America/New_York");
    const utc = decodeUtc("2026-02-10T00:30:00Z");

    expect(localDateFromUtc(utc, user.timezone)).toBe("2026-02-09");
  });

  it("should convert UTC to next local day when timezone leads UTC", () => {
    const user = makeUser("Asia/Tokyo");
    const utc = decodeUtc("2026-02-10T18:30:00Z");

    expect(localDateFromUtc(utc, user.timezone)).toBe("2026-02-11");
  });

  it("should compare local dates in a timezone", () => {
    const user = makeUser("America/New_York");
    const left = decodeUtc("2026-02-10T01:00:00Z");
    const sameLocalDate = decodeUtc("2026-02-10T04:00:00Z");
    const nextLocalDate = decodeUtc("2026-02-10T15:00:00Z");

    expect(isSameLocalDate(left, sameLocalDate, user.timezone)).toBe(true);
    expect(isSameLocalDate(left, nextLocalDate, user.timezone)).toBe(false);
  });
});
