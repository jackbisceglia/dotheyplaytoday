import { describe, expect, it } from "vitest";
import { Schema } from "effect";
import { exactOptional } from "@dtpt/core/lib/utils";
import { Subject } from "@dtpt/core/modules/subjects/schema";

import {
  getCollegeGroups,
  getCollegeTeams,
  isCollegeTeam,
  topRankedGroup,
} from "../college.js";
import { getTeams } from "../sports/index.js";
import { conferenceLabels } from "../sports/ncaam.js";

const team = (
  suffix: string,
  display: string,
  conferenceId: string,
  apRank?: number,
) =>
  Schema.decodeUnknownSync(Subject)({
    id: `20000000-0000-4000-8000-0000000000${suffix}`,
    _tag: "sports_team",
    details: {
      _tag: "sports_team",
      league: {
        id: "ncaam",
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
        acc: "Atlantic Coast",
      }).conferences,
    ).toEqual([
      { id: "a10", label: "Atlantic 10" },
      { id: "acc", label: "Atlantic Coast" },
      { id: "big-east", label: "Big East" },
    ]);
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
