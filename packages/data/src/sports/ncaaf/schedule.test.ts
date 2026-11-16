import { DateTime, Schema } from "effect";
import { describe, expect, it } from "vitest";

import { SportsSeed } from "../../schema/sports.js";
import { events } from "./events.js";
import { ncaafCollection } from "./index.js";
import { subjects } from "./subjects.js";

const confirmedEventCount = 707;

describe("2026 college football schedule", () => {
  it("decodes as a sports seed with 112 subjects", () => {
    expect(() =>
      Schema.decodeUnknownSync(SportsSeed)(ncaafCollection),
    ).not.toThrow();
    expect(subjects).toHaveLength(112);
    expect(events).toHaveLength(confirmedEventCount);
  });

  it("keeps verified kickoffs as UTC instants across daylight saving time", () => {
    const eastern = DateTime.zoneMakeNamedUnsafe("America/New_York");
    for (const [espnId, instant, hour] of [
      ["401866408", "2026-08-29T22:30:00Z", 18],
      ["401862844", "2026-12-12T20:00:00Z", 15],
    ] as const) {
      const event = events.find((event) => event.id.endsWith(espnId));
      expect(event?.startsAt).toBe(instant);
      expect(
        DateTime.toParts(
          DateTime.setZone(DateTime.makeUnsafe(instant), eastern),
        ).hour,
      ).toBe(hour);
    }
    expect(
      events.every((event) => /^2026-.*T\d{2}:\d{2}:00Z$/.test(event.startsAt)),
    ).toBe(true);
  });

  it("excludes unconfirmed placeholder times and provisional Pac-12 flex games", () => {
    expect(events.some((event) => event.id.endsWith("401858311"))).toBe(false);
    const pac12 = new Set<string>(
      subjects
        .filter((subject) => subject.details.league.conferenceId === "pac-12")
        .map((subject) => subject.details.display),
    );
    expect(
      events.some(
        (event) =>
          event.startsAt.startsWith("2026-11-28") &&
          event.participants.every((participant) =>
            pac12.has(participant.details.title),
          ),
      ),
    ).toBe(false);
  });

  it("has unique provider-backed event identities", () => {
    expect(new Set(events.map((event) => event.id)).size).toBe(
      confirmedEventCount,
    );
    expect(new Set(events.map((event) => event.sourceId)).size).toBe(
      confirmedEventCount,
    );
    expect(
      events.every((event) => event.sourceId.startsWith("sports_game:espn:")),
    ).toBe(true);
    expect(events.every((event) => event.details.leagueId === "ncaaf")).toBe(
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
