import { describe, expect, it } from "vitest";
import { Schema } from "effect";
import { exactOptional } from "@dtpt/core/lib/utils";
import { Subject } from "@dtpt/core/modules/subjects/schema";

import {
  conferenceLabels,
  getCollegeGroups,
  getCollegeTeams,
  isCollegeTeam,
  topRankedGroup,
} from "../college.js";
import { getTeams } from "../sports/index.js";

const team = (
  suffix: string,
  display: string,
  conferenceId: string,
  apRank?: number,
  leagueId = "ncaam",
) =>
  Schema.decodeUnknownSync(Subject)({
    id: `20000000-0000-4000-8000-0000000000${suffix}`,
    _tag: "sports_team",
    details: {
      _tag: "sports_team",
      league: {
        id: leagueId,
        conferenceId,
        ...exactOptional(apRank, (rank) => ({ apRank: rank })),
      },
      display,
      location: display,
      name: display,
      abbreviation: suffix,
    },
  });

const duke = team("11", "Duke Blue Devils", "acc", 1);
const miami = team("12", "Miami Hurricanes", "acc");
const uconn = team("13", "UConn Huskies", "big-east", 3);
const butler = team("14", "Butler Bulldogs", "big-east", 3);
const dayton = team("15", "Dayton Flyers", "a10");
const teams = getTeams([uconn, miami, dayton, duke, butler]).filter(
  isCollegeTeam,
);

describe("college browsing", () => {
  it("browses football with the same conference and ranking rules", () => {
    const alabama = team("21", "Alabama Crimson Tide", "sec", 2, "ncaaf");
    const army = team("22", "Army Black Knights", "aac", undefined, "ncaaf");
    const football = getTeams([army, alabama]).filter(isCollegeTeam);
    expect(football).toHaveLength(2);
    expect(getCollegeGroups(football, conferenceLabels)).toEqual({
      ranked: true,
      conferences: [
        { id: "aac", label: "American" },
        { id: "sec", label: "SEC" },
      ],
    });
    expect(getCollegeTeams(football, topRankedGroup)).toEqual([alabama]);
    expect(getCollegeTeams(football, "aac")).toEqual([army]);
  });

  it("lists only conferences with teams, sorted by label", () => {
    expect(getCollegeGroups(teams, conferenceLabels).conferences).toEqual([
      { id: "acc", label: "ACC" },
      { id: "a10", label: "Atlantic 10" },
      { id: "big-east", label: "Big East" },
    ]);
  });

  it("uses the labels supplied by the league catalog", () => {
    expect(
      getCollegeGroups(teams, {
        ...conferenceLabels,
        ncaam: { ...conferenceLabels.ncaam, acc: "Atlantic Coast" },
      }).conferences,
    ).toEqual([
      { id: "a10", label: "Atlantic 10" },
      { id: "acc", label: "Atlantic Coast" },
      { id: "big-east", label: "Big East" },
    ]);
  });

  it("keeps overlapping conference labels scoped to their league", () => {
    const footballDuke = team(
      "23",
      "Duke Blue Devils",
      "acc",
      undefined,
      "ncaaf",
    );
    const labels = {
      ncaam: { ...conferenceLabels.ncaam, acc: "Basketball ACC" },
      ncaaf: { ...conferenceLabels.ncaaf, acc: "Football ACC" },
    };

    expect(
      getCollegeGroups(getTeams([duke]).filter(isCollegeTeam), labels)
        .conferences,
    ).toEqual([{ id: "acc", label: "Basketball ACC" }]);
    expect(
      getCollegeGroups(getTeams([footballDuke]).filter(isCollegeTeam), labels)
        .conferences,
    ).toEqual([{ id: "acc", label: "Football ACC" }]);
  });

  it("has no groups or rankings without college teams", () => {
    expect(getCollegeGroups([], conferenceLabels)).toEqual({
      ranked: false,
      conferences: [],
    });
  });

  it("narrows college teams at the picker boundary", () => {
    const celtics = Schema.decodeUnknownSync(Subject)({
      id: "20000000-0000-4000-8000-000000000099",
      _tag: "sports_team",
      details: {
        _tag: "sports_team",
        league: { id: "nba", conferenceId: "east" },
        display: "Boston Celtics",
        location: "Boston",
        name: "Celtics",
        abbreviation: "BOS",
      },
    });
    expect(getTeams([duke, celtics]).filter(isCollegeTeam)).toEqual([duke]);
  });

  it("offers the Top 25 only once a team is ranked", () => {
    expect(getCollegeGroups(teams, conferenceLabels).ranked).toBe(true);
    expect(
      getCollegeGroups(
        getTeams([miami, dayton]).filter(isCollegeTeam),
        conferenceLabels,
      ).ranked,
    ).toBe(false);
  });

  it("orders the Top 25 by rank, keeping real gaps and breaking ties by name", () => {
    expect(getCollegeTeams(teams, topRankedGroup)).toEqual([
      duke,
      butler,
      uconn,
    ]);
  });

  it("shows a conference's teams by name", () => {
    expect(getCollegeTeams(teams, "acc")).toEqual([duke, miami]);
    expect(getCollegeTeams(teams, "big-east")).toEqual([butler, uconn]);
  });
});
