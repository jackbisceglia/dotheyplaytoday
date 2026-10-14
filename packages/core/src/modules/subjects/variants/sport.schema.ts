import { Schema } from "effect";

type SportLeague<
  Id extends string = string,
  ConferenceId extends string = string,
> = {
  readonly id: Id;
  readonly conferences: readonly ConferenceId[];
};

const createLeague = <const League extends SportLeague>(league: League) =>
  league;

const nba = createLeague({
  id: "nba",
  conferences: ["east", "west"],
});
const nfl = createLeague({
  id: "nfl",
  conferences: ["afc", "nfc"],
});
const mlb = createLeague({
  id: "mlb",
  conferences: ["al", "nl"],
});
const nhl = createLeague({
  id: "nhl",
  conferences: ["east", "west"],
});
const ncaam = createLeague({
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
});

const leagues = [nba, nfl, mlb, nhl, ncaam] as const;

export const SportLeagueId = Schema.Literals(
  leagues.map((league) => league.id),
);
export type SportLeagueId = typeof SportLeagueId.Type;

const createSportsTeamSubject = <
  const Id extends string,
  const ConferenceId extends string,
>(
  league: SportLeague<Id, ConferenceId>,
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
