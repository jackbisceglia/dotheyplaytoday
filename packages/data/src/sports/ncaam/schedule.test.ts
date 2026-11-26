import { Schema } from "effect";
import { describe, expect, it } from "vitest";

import { SportsSeed } from "../../schema/sports.js";
import { events } from "./events.js";
import { ncaamCollection } from "./index.js";
import { subjects } from "./subjects.js";

const storedEventCount = 1835;

describe("2026-27 NCAA men's basketball schedule", () => {
  it("decodes as a sports seed with 158 subjects", () => {
    expect(() =>
      Schema.decodeUnknownSync(SportsSeed)(ncaamCollection),
    ).not.toThrow();
    expect(subjects).toHaveLength(158);
    expect(events).toHaveLength(storedEventCount);
  });

  it("has unique provider-backed event identities", () => {
    expect(new Set(events.map((event) => event.id)).size).toBe(
      storedEventCount,
    );
    expect(new Set(events.map((event) => event.sourceId)).size).toBe(
      storedEventCount,
    );
    expect(
      events.every((event) => event.sourceId.startsWith("sports_game:espn:")),
    ).toBe(true);
    expect(events.every((event) => event.details.leagueId === "ncaam")).toBe(
      true,
    );
  });

  it("links every feed to a matching event and subject participant", () => {
    const eventBySource = new Map(
      events.map((event) => [event.sourceId, event]),
    );
    const supportedTitles = new Set<string>(
      subjects.map((subject) => subject.details.display),
    );

    for (const subject of subjects) {
      for (const sourceId of subject.feedIds) {
        const event = eventBySource.get(sourceId);
        expect(event, sourceId).toBeDefined();
        expect(
          event?.participants.some(
            (participant) =>
              participant.details.title === subject.details.display,
          ),
        ).toBe(true);
      }
    }

    for (const event of events) {
      for (const participant of event.participants) {
        const subject = subjects.find(
          (subject) => subject.details.display === participant.details.title,
        );
        if (subject) expect(subject.feedIds).toContain(event.sourceId);
      }
    }

    // one ESPN game can appear on two supported teams' feeds, but is one event.
    const multiSupported = events.filter((event) =>
      event.participants.every((participant) =>
        supportedTitles.has(participant.details.title),
      ),
    );
    for (const event of multiSupported) {
      const feedOwners = subjects.filter((subject) =>
        subject.feedIds.includes(event.sourceId),
      );
      expect(feedOwners).toHaveLength(2);
    }
  });

  it("deactivates the postponed Oregon–Pepperdine game without losing its identity or feeds", () => {
    const game = events.find((event) => event.id.endsWith("401926073"));
    expect(game?.availability).toBe("cancelled");
    expect(game?.startsAt).toBe("2026-11-15T22:00:00Z");
    expect(
      subjects.filter((subject) =>
        subject.feedIds.includes(game?.sourceId ?? ""),
      ),
    ).toHaveLength(2);
  });

  it.each([
    "401920517",
    "401920519",
    "401920520",
    "401921716",
    "401921713",
    "401921714",
    "401921672",
    "401929289",
  ])("links confirmed placement game %s to both supported teams", (espnId) => {
    const game = events.find((event) => event.id.endsWith(espnId));
    expect(game?.availability).toBe("active");
    expect(
      subjects.filter((subject) =>
        subject.feedIds.includes(game?.sourceId ?? ""),
      ),
    ).toHaveLength(2);
  });

  it("retains noncatalog opponents as participants without subject feeds", () => {
    const supportedTitles = new Set<string>(
      subjects.map((subject) => subject.details.display),
    );
    const noncatalogEvent = events.find((event) =>
      event.participants.some(
        (participant) => !supportedTitles.has(participant.details.title),
      ),
    );

    expect(noncatalogEvent).toBeDefined();
    expect(noncatalogEvent?.participants).toHaveLength(2);
  });
});
