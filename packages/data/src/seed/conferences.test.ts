import { describe, expect, it } from "vitest";
import { Schema } from "effect";
import { SportsSeed, type SportsSeedEncoded } from "../schema/sports.js";

import { mlbCollection } from "../sports/mlb/index.js";
import { nbaCollection } from "../sports/nba/index.js";
import { ncaamCollection } from "../sports/ncaam/index.js";
import { nflCollection } from "../sports/nfl/index.js";
import { nhlCollection } from "../sports/nhl/index.js";

type TeamDetail = Pick<SportsSeedEncoded["subjects"][number]["details"], "league" | "display">;

const byConference = (subjects: readonly { details: TeamDetail }[]) =>
  subjects.reduce<Record<string, number>>((counts, subject) => {
    const conferenceId = subject.details.league.conferenceId;
    counts[conferenceId] = (counts[conferenceId] ?? 0) + 1;
    return counts;
  }, {});

describe("conference coverage", () => {
  it("decodes nested team membership without changing catalog identities", () => {
    for (const collection of [
      nbaCollection,
      nflCollection,
      mlbCollection,
      nhlCollection,
      ncaamCollection,
    ]) {
      const decoded = Schema.decodeUnknownSync(SportsSeed)(collection);
      expect(decoded.subjects.map((subject) => subject.id)).toEqual(
        collection.subjects.map((subject) => subject.id),
      );
      for (const subject of decoded.subjects) {
        expect(subject.details.league.id).toBe(
          collection.id.replace("sports.", ""),
        );
        expect(subject.details).not.toHaveProperty("leagueId");
        expect(subject.details).not.toHaveProperty("conferenceId");
      }
    }
  });

  it("has exact conference counts", () => {
    expect(nbaCollection.subjects).toHaveLength(30);
    expect(byConference(nbaCollection.subjects)).toMatchObject({
      east: 15,
      west: 15,
    });

    expect(nhlCollection.subjects).toHaveLength(32);
    expect(byConference(nhlCollection.subjects)).toMatchObject({
      east: 16,
      west: 16,
    });

    expect(nflCollection.subjects).toHaveLength(32);
    expect(byConference(nflCollection.subjects)).toMatchObject({
      afc: 16,
      nfc: 16,
    });

    expect(mlbCollection.subjects).toHaveLength(30);
    expect(byConference(mlbCollection.subjects)).toMatchObject({
      al: 15,
      nl: 15,
    });

    expect(ncaamCollection.subjects).toHaveLength(158);
    expect(byConference(ncaamCollection.subjects)).toMatchObject({
      acc: 18,
      aac: 13,
      a10: 14,
      "big-ten": 18,
      "big-12": 16,
      "big-east": 11,
      mac: 12,
      mvc: 11,
      "mountain-west": 10,
      "pac-12": 9,
      sec: 16,
      wcc: 10,
    });
  });

  it("has representative affiliations", () => {
    const byDisplay = (collection: typeof nbaCollection) =>
      new Map(
        Array.from(collection.subjects).map((subject) => {
          return [subject.details.display, subject.details.league.conferenceId];
        }),
      );

    expect(byDisplay(nbaCollection).get("Boston Celtics")).toBe("east");
    expect(byDisplay(nbaCollection).get("Los Angeles Lakers")).toBe("west");
    expect(byDisplay(nflCollection).get("New England Patriots")).toBe("afc");
    expect(byDisplay(nflCollection).get("Dallas Cowboys")).toBe("nfc");
    expect(byDisplay(mlbCollection).get("New York Yankees")).toBe("al");
    expect(byDisplay(mlbCollection).get("Los Angeles Dodgers")).toBe("nl");
    expect(byDisplay(ncaamCollection).get("Gonzaga Bulldogs")).toBe("pac-12");
  });
});
