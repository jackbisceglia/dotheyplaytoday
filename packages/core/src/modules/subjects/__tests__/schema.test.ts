import { describe, expect, it } from "@effect/vitest";
import { expectTypeOf } from "vitest";
import { Schema } from "effect";

import { Subject, SubjectDetails, SubjectInsert } from "../schema.js";
import { MmaFighterSubject } from "../variants/mma.schema.js";
import {
  SportConferences,
  SportConferenceId,
  SportConferenceIds,
  SportLeagueIds,
  SportTeamSubject,
} from "../variants/sport.schema.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;

const subjectInput = {
  id: "00000000-0000-4000-8000-000000000301",
  _tag: "sports_team",
  details: {
    _tag: "sports_team",
    leagueId: "nba",
    location: "Boston",
    name: "Celtics",
    display: "Boston Celtics",
    abbreviation: "BOS",
    slug: "boston-celtics",
    conferenceId: "east",
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
    expect(SportLeagueIds).toEqual(["nba", "nfl", "mlb", "nhl", "ncaam"]);
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
        details: { ...subjectInput.details, leagueId: "epl" },
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

  it("rejects legacy subjects without conferenceId", () => {
    const { conferenceId: _conferenceId, ...legacy } = subjectInput.details;
    expect(() => decode(SportTeamSubject)(legacy)).toThrow();
  });

  it("encodes and decodes valid conference metadata", () => {
    const withConference = {
      ...subjectInput.details,
      leagueId: "nba",
      conferenceId: "east",
    };

    const decoded = decode(SportTeamSubject)(withConference);
    expect(decoded.conferenceId).toBe("east");
    expect(() => encode(SportTeamSubject)(decoded)).not.toThrow();
  });

  it("rejects unknown and mismatched conference ids", () => {
    expect(() =>
      decode(SportTeamSubject)({
        ...subjectInput.details,
        leagueId: "nba",
        conferenceId: "not-a-conference",
      }),
    ).toThrow();

    expect(() =>
      decode(SportTeamSubject)({
        ...subjectInput.details,
        leagueId: "nba",
        conferenceId: "nfc",
      }),
    ).toThrow();
  });

  it("has valid conference catalog consistency", () => {
    expect(SportTeamSubject.discriminants).toEqual(SportLeagueIds);
    const pairs = SportConferences.map(
      (conference) => `${conference.leagueId}:${conference.id}`,
    );
    expect(new Set(pairs).size).toBe(pairs.length);
    expect(SportConferenceIds).toEqual([
      ...new Set(SportConferences.map((conference) => conference.id)),
    ]);
    for (const conference of SportConferences) {
      expect(() =>
        decode(SportTeamSubject)({
          ...subjectInput.details,
          leagueId: conference.leagueId,
          conferenceId: conference.id,
        }),
      ).not.toThrow();
    }
  });

  it("derives outer tags and preserves tagged-union helpers", () => {
    expect(SubjectDetails.discriminants).toEqual([
      "sports_team",
      "mma_fighter",
      "mma_tracking",
    ]);
    expectTypeOf<typeof SubjectDetails.discriminants>().toEqualTypeOf<
      readonly ["sports_team", "mma_fighter", "mma_tracking"]
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
        sports_team: (details) => details.leagueId,
        mma_fighter: (details) => details.leagueId,
        mma_tracking: (details) => details.leagueId,
      }),
    ).toBe("nba");
  });

  it("narrows conference IDs by league at the type level", () => {
    type NbaSubject = Extract<SportTeamSubject, { leagueId: "nba" }>;
    type NhlSubject = Extract<SportTeamSubject, { leagueId: "nhl" }>;
    type NflSubject = Extract<SportTeamSubject, { leagueId: "nfl" }>;
    type MlbSubject = Extract<SportTeamSubject, { leagueId: "mlb" }>;
    type NcaamSubject = Extract<SportTeamSubject, { leagueId: "ncaam" }>;

    expectTypeOf<NbaSubject["conferenceId"]>().toEqualTypeOf<"east" | "west">();
    expectTypeOf<NhlSubject["conferenceId"]>().toEqualTypeOf<"east" | "west">();
    expectTypeOf<NflSubject["conferenceId"]>().toEqualTypeOf<"afc" | "nfc">();
    expectTypeOf<string>().not.toExtend<SportConferenceId>();
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
      leagueId: "nba",
      display: "Boston Celtics",
      location: "Boston",
      name: "Celtics",
      abbreviation: "BOS",
      conferenceId: "east",
    };

    // @ts-expect-error NBA cannot have an NFL conference.
    const invalidNba: SportTeamSubject = {
      ...valid,
      leagueId: "nba",
      conferenceId: "nfc",
    };
    // @ts-expect-error MLB cannot have an NCAAM conference.
    const invalidMlb: SportTeamSubject = {
      ...valid,
      leagueId: "mlb",
      conferenceId: "acc",
    };

    void [valid, invalidNba, invalidMlb];
  });
});
