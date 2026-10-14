import { describe, expect, it } from "vitest";
import { Schema } from "effect";
import { exactOptional } from "@dtpt/core/lib/utils";
import { Subject } from "@dtpt/core/modules/subjects/schema";

import {
  getCollegeGroups,
  getCollegeTeams,
  isCollegeLeague,
  topRankedGroup,
} from "../college.js";
import { getTeams } from "../sports/index.js";
import { getSubjectLeagueId } from "../index.js";
import { all } from "@dtpt/core/modules/mma/__tests__/fixtures";

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
      league: { id: "ncaam", conferenceId },
      display,
      location: display,
      name: display,
      abbreviation: suffix,
      ...exactOptional(apRank, (rank) => ({ apRank: rank })),
    },
  });

const duke = team("11", "Duke Blue Devils", "acc", 1);
const miami = team("12", "Miami Hurricanes", "acc");
const uconn = team("13", "UConn Huskies", "big-east", 3);
const butler = team("14", "Butler Bulldogs", "big-east", 3);
const dayton = team("15", "Dayton Flyers", "a10");
const teams = getTeams([uconn, miami, dayton, duke, butler]);

describe("college browsing", () => {
  it("reads nested sports membership and preserves flat MMA league IDs", () => {
    expect(getSubjectLeagueId(duke.details)).toBe("ncaam");
    expect(getSubjectLeagueId(all.details)).toBe("ufc");
  });
  it("is limited to college leagues", () => {
    expect(isCollegeLeague("ncaam")).toBe(true);
    expect(isCollegeLeague("nba")).toBe(false);
    expect(isCollegeLeague(undefined)).toBe(false);
  });

  it("lists only conferences with teams, sorted by label", () => {
    expect(getCollegeGroups(teams).conferences).toEqual([
      { id: "acc", label: "ACC" },
      { id: "a10", label: "Atlantic 10" },
      { id: "big-east", label: "Big East" },
    ]);
  });

  it("does not include pro conferences in college browsing", () => {
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
    expect(getCollegeGroups(getTeams([duke, celtics])).conferences).toEqual([
      { id: "acc", label: "ACC" },
    ]);
  });

  it("offers the Top 25 only once a team is ranked", () => {
    expect(getCollegeGroups(teams).ranked).toBe(true);
    expect(getCollegeGroups(getTeams([miami, dayton])).ranked).toBe(false);
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
