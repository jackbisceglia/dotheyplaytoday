import { describe, expect, it } from "vitest";

import { mlbCollection } from "../sports/mlb/index.js";
import { nbaCollection } from "../sports/nba/index.js";
import { ncaamCollection } from "../sports/ncaam/index.js";
import { nflCollection } from "../sports/nfl/index.js";
import { nhlCollection } from "../sports/nhl/index.js";

type TeamDetail = Readonly<{ conferenceId?: string; display: string }>;

const byConference = (subjects: readonly { details: TeamDetail }[]) =>
  subjects.reduce<Record<string, number>>((counts, subject) => {
    const conferenceId = subject.details.conferenceId;
    if (!conferenceId) throw new Error("Missing conference");
    counts[conferenceId] = (counts[conferenceId] ?? 0) + 1;
    return counts;
  }, {});

describe("conference coverage", () => {
  it("has exact conference counts", () => {
    expect(nbaCollection.subjects).toHaveLength(30);
    expect(byConference(nbaCollection.subjects as never)).toMatchObject({
      east: 15,
      west: 15,
    });

    expect(nhlCollection.subjects).toHaveLength(32);
    expect(byConference(nhlCollection.subjects as never)).toMatchObject({
      east: 16,
      west: 16,
    });

    expect(nflCollection.subjects).toHaveLength(32);
    expect(byConference(nflCollection.subjects as never)).toMatchObject({
      afc: 16,
      nfc: 16,
    });

    expect(mlbCollection.subjects).toHaveLength(30);
    expect(byConference(mlbCollection.subjects as never)).toMatchObject({
      al: 15,
      nl: 15,
    });

    expect(ncaamCollection.subjects).toHaveLength(158);
    expect(byConference(ncaamCollection.subjects as never)).toMatchObject({
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
        (collection.subjects as unknown as { details: { display: string; conferenceId?: string } }[]).map(
          (subject) => [subject.details.display, subject.details.conferenceId],
        ),
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
