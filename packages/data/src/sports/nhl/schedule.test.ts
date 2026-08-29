import { Schema } from "effect";
import { describe, expect, it } from "vitest";

import { SportsSeed } from "../../schema/sports.js";
import type { SportsSeedEncoded } from "../../schema/sports.js";
import { events } from "./events.js";
import { nhlCollection } from "./index.js";
import { subjects } from "./subjects.js";

const announcedGameCount = 1_344;
// The 2026-27 season is the first to run 84 games per team.
const gamesPerTeam = 84;
const scheduleEvents: readonly SportsSeedEncoded["events"][number][] = events;
type ScheduleEvent = (typeof scheduleEvents)[number];

type TeamScheduleGame = {
  readonly event: ScheduleEvent;
  readonly opponent: string;
  readonly role: "home" | "away";
};

const scheduleKey = (startsAt: string, opponent: string) =>
  `${startsAt}|${opponent}`;

describe("2026-27 NHL schedule", () => {
  it("decodes as a sports seed with every announced game and team", () => {
    expect(() =>
      Schema.decodeUnknownSync(SportsSeed)(nhlCollection),
    ).not.toThrow();
    expect(subjects).toHaveLength(32);
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
    >(subjects.map((subject) => [subject.details.display, subject]));
    const feedCounts = new Map<string, number>();

    expect(subjectsByTitle.size).toBe(subjects.length);

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
        expect(subject, participant.details.title).toBeDefined();
        expect(subject?.feedIds).toContain(event.sourceId);
      }
    }
  });

  it("matches every team game to the opponent's entry on the same date", () => {
    const eventsBySourceId = new Map(
      scheduleEvents.map((event) => [event.sourceId, event]),
    );
    const schedulesByTeam = new Map<string, Map<string, TeamScheduleGame>>();

    for (const subject of subjects) {
      const team = subject.details.display;
      const teamSchedule = new Map<string, TeamScheduleGame>();

      for (const sourceId of subject.feedIds) {
        const event = eventsBySourceId.get(sourceId);
        if (!event)
          throw new Error(`${team} references missing game ${sourceId}`);

        const teamParticipant = event.participants.find(
          (participant) => participant.details.title === team,
        );
        if (!teamParticipant) {
          throw new Error(`${team} is not a participant in ${sourceId}`);
        }

        const opponent = event.participants.find(
          (participant) => participant.details.title !== team,
        )?.details.title;
        if (!opponent)
          throw new Error(`${team} has no opponent in ${sourceId}`);

        const key = scheduleKey(event.startsAt, opponent);
        if (teamSchedule.has(key)) {
          throw new Error(`${team} has duplicate game ${key}`);
        }

        teamSchedule.set(key, {
          event,
          opponent,
          role: teamParticipant.details.role,
        });
      }

      expect(teamSchedule.size).toBe(gamesPerTeam);
      schedulesByTeam.set(team, teamSchedule);
    }

    for (const [team, teamSchedule] of schedulesByTeam) {
      for (const game of teamSchedule.values()) {
        const reciprocal = schedulesByTeam
          .get(game.opponent)
          ?.get(scheduleKey(game.event.startsAt, team));
        if (!reciprocal) {
          throw new Error(
            `${game.opponent} is missing ${team} at ${game.event.startsAt}`,
          );
        }

        expect(reciprocal.opponent).toBe(team);
        expect(reciprocal.role).toBe(game.role === "home" ? "away" : "home");
        expect(reciprocal.event.sourceId).toBe(game.event.sourceId);
        expect(reciprocal.event.startsAt).toBe(game.event.startsAt);
        expect(reciprocal.event).toEqual(game.event);
      }
    }
  });

  it("splits home designations 42/42 apart from the Düsseldorf pair", () => {
    const homeCounts = new Map<string, number>();

    for (const event of scheduleEvents) {
      for (const participant of event.participants) {
        if (participant.details.role !== "home") continue;
        const title = participant.details.title;
        homeCounts.set(title, (homeCounts.get(title) ?? 0) + 1);
      }
    }

    // Ottawa is the home team for both neutral-site Düsseldorf games.
    expect(homeCounts.get("Ottawa Senators")).toBe(43);
    expect(homeCounts.get("Chicago Blackhawks")).toBe(41);

    for (const subject of subjects) {
      const team = subject.details.display;
      if (team === "Ottawa Senators" || team === "Chicago Blackhawks") continue;
      expect(homeCounts.get(team), team).toBe(gamesPerTeam / 2);
    }
  });

  it("covers the announced season window and Carolina Hurricanes feed", () => {
    const startsAt = scheduleEvents.map((event) => event.startsAt).sort();
    expect(startsAt[0]).toBe("2026-09-29T21:00:00Z");
    expect(startsAt.at(-1)).toBe("2027-04-11T02:30:00Z");

    const carolina = subjects.find(
      (subject) => subject.details.display === "Carolina Hurricanes",
    );
    expect(carolina?.feedIds).toHaveLength(gamesPerTeam);
  });
});
