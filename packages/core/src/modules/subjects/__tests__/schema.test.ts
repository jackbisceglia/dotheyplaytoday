import { describe, expect, it } from "@effect/vitest";
import { expectTypeOf } from "vitest";
import { Schema } from "effect";

import { Subject, SubjectDetails, SubjectInsert } from "../schema.js";
import { MmaFighterSubject } from "../variants/mma.schema.js";
import {
  SportLeague,
  SportLeagueId,
  SportTeamSubject,
} from "../variants/sport.schema.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;

const subjectInput = {
  id: "00000000-0000-4000-8000-000000000301",
  _tag: "sports_team",
  details: {
    _tag: "sports_team",
    league: { id: "nba", conferenceId: "east" },
    location: "Boston",
    name: "Celtics",
    display: "Boston Celtics",
    abbreviation: "BOS",
    slug: "boston-celtics",
  },
};

describe("Subject model", () => {
  const fighter = {
    _tag: "mma_fighter",
    leagueId: "ufc",
    display: "Fighter",
  };

  it("decodes older fighter details with a null P4P rank", () => {
    const details = decode(MmaFighterSubject)(fighter);
    expect(details.p4p).toBeNull();
    expect(encode(MmaFighterSubject)(details)).toEqual({
      ...fighter,
      p4p: null,
    });
  });

  it("accepts null or a valid P4P rank and rejects invalid ranks", () => {
    for (const p4p of [null, 1, 10, 15]) {
      expect(decode(MmaFighterSubject)({ ...fighter, p4p }).p4p).toBe(p4p);
    }
    for (const p4p of [0, -1, 16, 1.5, "1"]) {
      expect(() => decode(MmaFighterSubject)({ ...fighter, p4p })).toThrow();
    }
  });

  it("lists supported league ids", () => {
    expect(SportLeagueId.literals).toEqual([
      "nba",
      "nfl",
      "mlb",
      "nhl",
      "ncaam",
    ]);
  });

  it("rejects malformed subject-owned fields and details", () => {
    expect(() =>
      decode(Subject)({ ...subjectInput, id: "not-uuid" }),
    ).toThrow();
    expect(() =>
      decode(Subject)({ ...subjectInput, _tag: "campus_group" }),
    ).toThrow();
    expect(() =>
      decode(Subject)({
        ...subjectInput,
        details: {
          ...subjectInput.details,
          league: { id: "epl", conferenceId: "east" },
        },
      }),
    ).toThrow();
    expect(() =>
      decode(Subject)({
        ...subjectInput,
        details: { ...subjectInput.details, name: "" },
      }),
    ).toThrow();
  });

  it("encodes and decodes the subject row boundary", () => {
    const subject = decode(Subject)(subjectInput);
    const insert = encode(SubjectInsert)(subject);
    const selected = decode(Subject)(insert);

    expect(insert).toEqual(subjectInput);
    expect(selected._tag).toBe(subject._tag);
    expect(selected.details).toEqual(subject.details);
  });

  it("requires nested league membership and rejects the old flat shape", () => {
    const { league, ...withoutLeague } = subjectInput.details;
    for (const input of [
      withoutLeague,
      {
        ...withoutLeague,
        leagueId: league.id,
        conferenceId: league.conferenceId,
      },
      { ...withoutLeague, league: { id: league.id } },
      { ...withoutLeague, league: { conferenceId: league.conferenceId } },
    ]) {
      expect(() => decode(SportTeamSubject)(input)).toThrow();
    }
  });

  it("encodes and decodes valid conference metadata", () => {
    const withConference = {
      ...subjectInput.details,
      league: { id: "nba", conferenceId: "east" },
    };

    const decoded = decode(SportTeamSubject)(withConference);
    expect(decoded.league.conferenceId).toBe("east");
    expect(() => encode(SportTeamSubject)(decoded)).not.toThrow();
  });

  it("rejects unknown and mismatched conference ids", () => {
    expect(() =>
      decode(SportTeamSubject)({
        ...subjectInput.details,
        league: { id: "nba", conferenceId: "not-a-conference" },
      }),
    ).toThrow();

    expect(() =>
      decode(SportTeamSubject)({
        ...subjectInput.details,
        league: { id: "nba", conferenceId: "nfc" },
      }),
    ).toThrow();
  });

  it("accepts AP ranks from 1 to 25 and treats a missing rank as unranked", () => {
    expect(
      decode(SportTeamSubject)(subjectInput.details).apRank,
    ).toBeUndefined();
    for (const apRank of [1, 13, 25]) {
      expect(
        decode(SportTeamSubject)({ ...subjectInput.details, apRank }).apRank,
      ).toBe(apRank);
    }
    for (const apRank of [0, 26, 1.5, "1", null]) {
      expect(() =>
        decode(SportTeamSubject)({ ...subjectInput.details, apRank }),
      ).toThrow();
    }
  });

  it("accepts each league's schema-defined conferences without duplicate IDs", () => {
    expect(SportLeague.discriminants).toEqual(SportLeagueId.literals);
    for (const leagueId of SportLeague.discriminants) {
      const conferences =
        SportLeague.cases[leagueId].fields.conferenceId.literals;
      expect(new Set(conferences).size).toBe(conferences.length);
      for (const conferenceId of conferences) {
        expect(() =>
          decode(SportTeamSubject)({
            ...subjectInput.details,
            league: { id: leagueId, conferenceId },
          }),
        ).not.toThrow();
      }
    }
  });

  it("derives outer tags and preserves tagged-union helpers", () => {
    expect(SubjectDetails.tags).toEqual([
      "sports_team",
      "mma_fighter",
      "mma_tracking",
    ]);
    expectTypeOf<(typeof SubjectDetails.tags)[number]>().toEqualTypeOf<
      "sports_team" | "mma_fighter" | "mma_tracking"
    >();
    const team = decode(SubjectDetails)(subjectInput.details);
    const mma = decode(SubjectDetails)(fighter);
    expect(SubjectDetails.isAnyOf(["mma_fighter", "mma_tracking"])(team)).toBe(
      false,
    );
    expect(SubjectDetails.isAnyOf(["mma_fighter", "mma_tracking"])(mma)).toBe(
      true,
    );
    expect(
      SubjectDetails.match(team, {
        sports_team: (details) => details.league.id,
        mma_fighter: (details) => details.leagueId,
        mma_tracking: (details) => details.leagueId,
      }),
    ).toBe("nba");
  });

  it("narrows conference IDs by league at the type level", () => {
    type NbaSubject = Extract<SportTeamSubject["league"], { id: "nba" }>;
    type NhlSubject = Extract<SportTeamSubject["league"], { id: "nhl" }>;
    type NflSubject = Extract<SportTeamSubject["league"], { id: "nfl" }>;
    type MlbSubject = Extract<SportTeamSubject["league"], { id: "mlb" }>;
    type NcaamSubject = Extract<SportTeamSubject["league"], { id: "ncaam" }>;

    expectTypeOf<NbaSubject["conferenceId"]>().toEqualTypeOf<"east" | "west">();
    expectTypeOf<NhlSubject["conferenceId"]>().toEqualTypeOf<"east" | "west">();
    expectTypeOf<NflSubject["conferenceId"]>().toEqualTypeOf<"afc" | "nfc">();
    expectTypeOf<string>().not.toExtend<
      SportTeamSubject["league"]["conferenceId"]
    >();
    expectTypeOf<MlbSubject["conferenceId"]>().toEqualTypeOf<"al" | "nl">();
    expectTypeOf<NcaamSubject["conferenceId"]>().toEqualTypeOf<
      | "acc"
      | "aac"
      | "a10"
      | "big-east"
      | "big-ten"
      | "big-12"
      | "mac"
      | "mvc"
      | "mountain-west"
      | "pac-12"
      | "sec"
      | "wcc"
    >();

    const valid: SportTeamSubject = {
      _tag: "sports_team",
      league: { id: "nba", conferenceId: "east" },
      display: "Boston Celtics",
      location: "Boston",
      name: "Celtics",
      abbreviation: "BOS",
    };

    expectTypeOf<{
      id: "nba";
      conferenceId: "nfc";
    }>().not.toExtend<SportLeague>();
    expectTypeOf<{
      id: "mlb";
      conferenceId: "acc";
    }>().not.toExtend<SportLeague>();
    if (valid.league.id === "nba") {
      expectTypeOf(valid.league.conferenceId).toEqualTypeOf<"east" | "west">();
    }
  });
});
