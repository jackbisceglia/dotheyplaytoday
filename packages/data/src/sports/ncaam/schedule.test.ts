import { Schema } from "effect";
import { describe, expect, it } from "vitest";

import { SportsSeed } from "../../schema/sports.js";
import { createNcaamEvents, events } from "./events.js";
import { ncaamCollection } from "./index.js";
import { subjects } from "./subjects.js";

const confirmedEventCount = 1604;

describe("2026-27 NCAA men's basketball schedule", () => {
  it("decodes as a sports seed with 158 subjects", () => {
    expect(() => Schema.decodeUnknownSync(SportsSeed)(ncaamCollection)).not.toThrow();
    expect(subjects).toHaveLength(158);
    expect(events).toHaveLength(confirmedEventCount);
  });

  it("has unique provider-backed event identities", () => {
    expect(new Set(events.map((event) => event.id)).size).toBe(confirmedEventCount);
    expect(new Set(events.map((event) => event.sourceId)).size).toBe(confirmedEventCount);
    expect(events.every((event) => event.sourceId.startsWith("sports_game:espn:"))).toBe(true);
    expect(events.every((event) => event.details.leagueId === "ncaam")).toBe(true);
  });

  it("links every feed to a matching event and subject participant", () => {
    const eventBySource = new Map(events.map((event) => [event.sourceId, event]));
    const supportedTitles = new Set(subjects.map((subject) => subject.details.display));

    for (const subject of subjects) {
      for (const sourceId of subject.feedIds) {
        const event = eventBySource.get(sourceId);
        expect(event, sourceId).toBeDefined();
        expect(event?.participants.some((participant) => participant.details.title === subject.details.display)).toBe(true);
      }
    }

    // one ESPN game can appear on two supported teams' feeds, but is one event.
    const multiSupported = events.filter((event) =>
      event.participants.every((participant) => supportedTitles.has(participant.details.title)),
    );
    for (const event of multiSupported) {
      const feedOwners = subjects.filter((subject) =>
        subject.feedIds.includes(event.sourceId),
      );
      expect(feedOwners).toHaveLength(2);
    }
  });

  it("retains noncatalog opponents as participants without subject feeds", () => {
    const supportedTitles = new Set(subjects.map((subject) => subject.details.display));
    const noncatalogEvent = events.find((event) =>
      event.participants.some((participant) => !supportedTitles.has(participant.details.title)),
    );

    expect(noncatalogEvent).toBeDefined();
    expect(noncatalogEvent?.participants).toHaveLength(2);
  });

  it("rejects unconfirmed provider starts before creating active seeds", () => {
    const confirmed = createNcaamEvents([
      ["401999999", "2026-12-01T00:00:00Z", "Example Home", "Example Away", true],
    ]);
    const excluded = createNcaamEvents([
      ["401999998", "2026-12-01T00:00:00Z", "Example Home", "Example Away", false],
    ]);

    expect(confirmed).toHaveLength(1);
    expect(confirmed[0]?.availability).toBe("active");
    expect(excluded).toHaveLength(0);
  });
});
