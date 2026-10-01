import { describe, expect, it } from "@effect/vitest";
import { Schema } from "effect";

import { EventsResponse } from "../events.js";

const response = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    userId: "00000000-0000-4000-8000-000000000002",
    subjectId: "00000000-0000-4000-8000-000000000003",
    subject: {
      id: "00000000-0000-4000-8000-000000000003",
      _tag: "sports_team",
      details: {
        _tag: "sports_team",
        leagueId: "nba",
        display: "Boston Celtics",
        name: "Celtics",
        location: "Boston",
        abbreviation: "BOS",
      },
    },
    schedule: { _tag: "fixed_local_time", sendAtSecondsLocal: 32400 },
    lastSentAt: null,
    events: [
      {
        id: "00000000-0000-4000-8000-000000000010",
        _tag: "sports_game",
        sourceId: "sports_game:manual:00000000-0000-4000-8000-000000000010",
        startsAt: "2026-03-08T23:30:00.000Z",
        availability: "active",
        details: { _tag: "sports_game", leagueId: "nba" },
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
  },
];

describe("events response contract", () => {
  it("round trips subscriptions and events with participants", () => {
    expect(
      Schema.encodeSync(EventsResponse)(
        Schema.decodeUnknownSync(EventsResponse)(response),
      ),
    ).toEqual(response);
    expect(Schema.decodeUnknownSync(EventsResponse)([])).toEqual([]);
    expect(
      Schema.decodeUnknownSync(EventsResponse)([
        { ...response[0], events: [] },
      ])[0]?.events,
    ).toEqual([]);
  });
  it("requires participants on each event", () => {
    expect(() =>
      Schema.decodeUnknownSync(EventsResponse)([
        {
          ...response[0],
          events: [{ ...response[0]?.events[0], participants: undefined }],
        },
      ]),
    ).toThrow();
  });
});
