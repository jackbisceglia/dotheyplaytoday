import { describe, expect, it } from "@effect/vitest";
import { Schema } from "effect";

import { SubscriptionsResponse } from "../subscription.js";

const response = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    userId: "00000000-0000-4000-8000-000000000002",
    subjectId: "00000000-0000-4000-8000-000000000003",
    schedule: { _tag: "fixed_local_time", sendAtSecondsLocal: 32400 },
    lastSentAt: "2026-01-01T14:00:00.000Z",
    subject: {
      id: "00000000-0000-4000-8000-000000000003",
      _tag: "sports_team",
      details: {
        _tag: "sports_team",
        leagueId: "nba",
        display: "Boston Celtics",
        location: "Boston",
        name: "Celtics",
        abbreviation: "BOS",
      },
    },
  },
];

describe("subscription response contract", () => {
  it("round trips subscriptions with their subjects and supports an empty list", () => {
    const decoded = Schema.decodeUnknownSync(SubscriptionsResponse)(response);
    expect(Schema.encodeSync(SubscriptionsResponse)(decoded)).toEqual(response);
    expect(Schema.decodeUnknownSync(SubscriptionsResponse)([])).toEqual([]);
  });

  it("rejects subscriptions without a decoded subject", () => {
    expect(() =>
      Schema.decodeUnknownSync(SubscriptionsResponse)([
        { ...response[0], subject: undefined },
      ]),
    ).toThrow();
  });
});
