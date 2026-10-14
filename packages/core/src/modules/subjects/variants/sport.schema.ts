import { Schema } from "effect";

type SportLeagueDefinition<
  Id extends string = string,
  ConferenceId extends string = string,
> = {
  readonly id: Id;
  readonly conferences: readonly ConferenceId[];
};

const nba = {
  id: "nba",
  conferences: ["east", "west"],
} as const satisfies SportLeagueDefinition;
const nfl = {
  id: "nfl",
  conferences: ["afc", "nfc"],
} as const satisfies SportLeagueDefinition;
const mlb = {
  id: "mlb",
  conferences: ["al", "nl"],
} as const satisfies SportLeagueDefinition;
const nhl = {
  id: "nhl",
  conferences: ["east", "west"],
} as const satisfies SportLeagueDefinition;
const ncaam = {
  id: "ncaam",
  conferences: [
    "acc",
    "aac",
    "a10",
    "big-east",
    "big-ten",
    "big-12",
    "mac",
    "mvc",
    "mountain-west",
    "pac-12",
    "sec",
    "wcc",
  ],
} as const satisfies SportLeagueDefinition;

const leagues = [nba, nfl, mlb, nhl, ncaam] as const;

export const SportLeagueIds = leagues.map((league) => league.id);
export const SportLeagueId = Schema.Literals(SportLeagueIds);
export type SportLeagueId = typeof SportLeagueId.Type;

export const SportConferences = leagues.flatMap((league) =>
  league.conferences.map((id) => ({
    id,
    leagueId: league.id,
  })),
);

export const SportConferenceIds = [
  ...new Set(SportConferences.map((conference) => conference.id)),
];
export const SportConferenceId = Schema.Literals(SportConferenceIds);
export type SportConferenceId = typeof SportConferenceId.Type;

export const getSportConference = (
  leagueId: SportLeagueId,
  conferenceId: SportConferenceId,
) =>
  SportConferences.find(
    (conference) =>
      conference.id === conferenceId && conference.leagueId === leagueId,
  );

const createSportsTeamSubject = <
  const Id extends string,
  const ConferenceId extends string,
>(
  league: SportLeagueDefinition<Id, ConferenceId>,
) =>
  Schema.TaggedStruct("sports_team", {
    leagueId: Schema.Literal(league.id),
    conferenceId: Schema.Literals(league.conferences),
    display: Schema.NonEmptyString,
    location: Schema.NonEmptyString,
    name: Schema.NonEmptyString,
    abbreviation: Schema.NonEmptyString,
    slug: Schema.optional(Schema.NonEmptyString),
  });

export const SportTeamSubject = Schema.Union([
  createSportsTeamSubject(nba),
  createSportsTeamSubject(nfl),
  createSportsTeamSubject(mlb),
  createSportsTeamSubject(nhl),
  createSportsTeamSubject(ncaam),
]).pipe(Schema.toTaggedUnion("leagueId"));

export type SportTeamSubject = typeof SportTeamSubject.Type;
