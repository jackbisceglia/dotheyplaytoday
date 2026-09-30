import { describe, expect, it } from "@effect/vitest";
import { Schema } from "effect";

import { EventsResponse } from "../events.js";

const response = {
  today: "2026-03-08",
  timezone: "America/New_York",
  events: [
    {
      id: "00000000-0000-4000-8000-000000000010",
      _tag: "sports_game",
      sourceId: "sports_game:manual:00000000-0000-4000-8000-000000000010",
      startsAt: "2026-03-08T23:30:00.000Z",
      availability: "active",
      details: { _tag: "sports_game", leagueId: "nba" },
      subjectIds: ["00000000-0000-4000-8000-000000000003"],
      participants: [
        {
          id: "00000000-0000-4000-8000-000000000011",
          eventId: "00000000-0000-4000-8000-000000000010",
          _tag: "sports_game",
          details: {
            _tag: "sports_game",
            role: "home",
            title: "Boston Celtics",
          },
        },
      ],
    },
  ],
};

describe("events response contract", () => {
  it("round trips participants, subscribed subjects, and the local calendar", () => {
    expect(
      Schema.encodeSync(EventsResponse)(
        Schema.decodeUnknownSync(EventsResponse)(response),
      ),
    ).toEqual(response);
    expect(
      Schema.decodeUnknownSync(EventsResponse)({ ...response, events: [] })
        .events,
    ).toEqual([]);
  });
  it("requires participants and at least one matching subject on each event", () => {
    for (const override of [{ participants: undefined }, { subjectIds: [] }]) {
      expect(() =>
        Schema.decodeUnknownSync(EventsResponse)({
          ...response,
          events: [{ ...response.events[0], ...override }],
        }),
      ).toThrow();
    }
  });
});
