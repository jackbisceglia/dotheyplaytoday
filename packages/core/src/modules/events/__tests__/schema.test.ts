import { describe, expect, it } from "vitest";
import { Schema } from "effect";

import { card } from "../../mma/__tests__/fixtures.js";
import { EventWithParticipants } from "../joined.js";
import { Participant, ParticipantInsert } from "../participants/schema.js";
import { Event, EventInsert } from "../schema.js";

describe("event variant tags", () => {
  it("requires matching event tags on reads and writes", () => {
    const sports = {
      ...card,
      _tag: "sports_game" as const,
      details: { _tag: "sports_game" as const, leagueId: "nba" as const },
      participants: [],
    };

    for (const schema of [Event, EventInsert, EventWithParticipants]) {
      const encode = Schema.encodeSync(schema);
      const decode = Schema.decodeUnknownSync(schema);
      for (const event of [card, sports]) {
        const encoded = encode(event);
        expect(() => decode(encoded)).not.toThrow();
        const wrongTag = event._tag === "mma_card" ? "sports_game" : "mma_card";
        expect(() => encode({ ...event, _tag: wrongTag })).toThrow(
          "Row tag must match details tag",
        );
        expect(() => decode({ ...encoded, _tag: wrongTag })).toThrow(
          "Row tag must match details tag",
        );
      }
    }
  });

  it("requires matching participant tags, including within joined events", () => {
    const mma = card.participants[0];
    if (!mma) throw new Error("Expected fighter participant");
    const sports = {
      ...mma,
      _tag: "sports_game" as const,
      details: {
        _tag: "sports_game" as const,
        title: "Test team",
        role: "home" as const,
      },
    };

    for (const schema of [Participant, ParticipantInsert]) {
      const encode = Schema.encodeSync(schema);
      const decode = Schema.decodeUnknownSync(schema);
      for (const participant of [mma, sports]) {
        const encoded = encode(participant);
        expect(() => decode(encoded)).not.toThrow();
        const wrongTag =
          participant._tag === "mma_card" ? "sports_game" : "mma_card";
        expect(() => encode({ ...participant, _tag: wrongTag })).toThrow(
          "Row tag must match details tag",
        );
        expect(() => decode({ ...encoded, _tag: wrongTag })).toThrow(
          "Row tag must match details tag",
        );
      }
    }

    const encoded = Schema.encodeSync(EventWithParticipants)(card);
    expect(() =>
      Schema.decodeUnknownSync(EventWithParticipants)({
        ...encoded,
        participants: encoded.participants.map((participant) => ({
          ...participant,
          _tag: "sports_game",
        })),
      }),
    ).toThrow("Row tag must match details tag");
  });
});
