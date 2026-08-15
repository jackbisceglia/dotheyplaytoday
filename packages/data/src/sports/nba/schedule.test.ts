import { Schema } from "effect";
import { describe, expect, it } from "vitest";

import { SportsSeed } from "../../schema/sports.js";
import type { SportsSeedEncoded } from "../../schema/sports.js";
import { events } from "./events.js";
import { nbaCollection } from "./index.js";
import { subjects } from "./subjects.js";

const announcedGameCount = 1_200;
// Two NBA Cup flex games per team still lack concrete matchups and times.
const gamesPerTeam = 80;
const scheduleEvents: readonly SportsSeedEncoded["events"][number][] = events;

describe("2026-27 NBA schedule", () => {
  it("decodes as a sports seed with every announced game and team", () => {
    expect(() =>
      Schema.decodeUnknownSync(SportsSeed)(nbaCollection),
    ).not.toThrow();
    expect(subjects).toHaveLength(30);
    expect(scheduleEvents).toHaveLength(announcedGameCount);
  });

  it("has unique ESPN-backed event identities", () => {
    expect(new Set(scheduleEvents.map((event) => event.id)).size).toBe(
      announcedGameCount,
    );
    expect(new Set(scheduleEvents.map((event) => event.sourceId)).size).toBe(
      announcedGameCount,
    );
    expect(
      scheduleEvents.every((event) =>
        event.sourceId.startsWith("sports_game:espn:"),
      ),
    ).toBe(true);
  });

  it("links every game to both participating teams exactly once", () => {
    const subjectsByTitle = new Map<
      string,
      SportsSeedEncoded["subjects"][number]
    >(
      subjects.map((subject) => [subject.details.display, subject]),
    );
    const feedCounts = new Map<string, number>();

    for (const subject of subjects) {
      expect(subject.feedIds).toHaveLength(gamesPerTeam);
      expect(new Set(subject.feedIds).size).toBe(gamesPerTeam);

      for (const sourceId of subject.feedIds) {
        feedCounts.set(sourceId, (feedCounts.get(sourceId) ?? 0) + 1);
      }
    }

    expect(feedCounts.size).toBe(announcedGameCount);
    expect([...feedCounts.values()].every((count) => count === 2)).toBe(true);

    for (const event of scheduleEvents) {
      expect(event.participants).toHaveLength(2);
      expect(
        event.participants.map((participant) => participant.details.role),
      ).toEqual(["home", "away"]);

      for (const participant of event.participants) {
        const subject = subjectsByTitle.get(participant.details.title);
        expect(subject?.feedIds).toContain(event.sourceId);
      }
    }
  });

  it("covers the announced season window and Boston Celtics feed", () => {
    const startsAt = scheduleEvents.map((event) => event.startsAt).sort();
    expect(startsAt[0]).toBe("2026-10-20T19:00:00Z");
    expect(startsAt.at(-1)).toBe("2027-04-12T00:30:00Z");

    const boston = subjects.find(
      (subject) => subject.details.display === "Boston Celtics",
    );
    expect(boston?.feedIds).toHaveLength(gamesPerTeam);
  });
});
