import { DateTime, Schema } from "effect";
import { describe, expect, it } from "vitest";

import { SportsSeed } from "../../schema/sports.js";
import { events } from "./events.js";
import { ncaafCollection } from "./index.js";
import { subjects } from "./subjects.js";

const confirmedEventCount = 762;

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
      ["401858311", "2026-11-28T17:00:00Z", 12],
      ["401856752", "2026-11-21T20:45:00Z", 15],
      ["401866475", "2026-11-28T20:30:00Z", 15],
      ["401858312", "2026-11-28T20:30:00Z", 15],
      ["401860928", "2026-11-29T02:30:00Z", 21],
      ["401858536", "2026-11-27T17:08:00Z", 12],
      ["401869533", "2026-12-05T01:00:00Z", 20],
      ["401869542", "2026-12-05T01:00:00Z", 20],
      ["401858318", "2026-12-05T17:00:00Z", 12],
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

  it("includes confirmed flex opponents and excludes incomplete championships", () => {
    const flexGames = [
      ["401860926", "Colorado State Rams", "Boise State Broncos"],
      ["401860927", "Fresno State Bulldogs", "Oregon State Beavers"],
      ["401860928", "Utah State Aggies", "Texas State Bobcats"],
      ["401860929", "Washington State Cougars", "San Diego State Aztecs"],
    ] as const;
    for (const [id, home, away] of flexGames) {
      const event = events.find((event) => event.id.endsWith(id));
      expect(
        event?.participants.map((participant) => participant.details.title),
      ).toEqual([home, away]);
    }
    expect(events.some((event) => event.id.endsWith("401869545"))).toBe(false);
    expect(
      events.every((event) =>
        event.participants.every(
          (participant) => participant.details.title !== "TBD",
        ),
      ),
    ).toBe(true);
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
