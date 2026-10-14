import { Schema } from "effect";

type League<
  Id extends string = string,
  ConferenceId extends string = string,
> = {
  readonly id: Id;
  readonly conferences: readonly ConferenceId[];
};

const createLeague = <const Config extends League>(league: Config) => league;

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

const createLeagueSchema = <
  const Id extends string,
  const ConferenceId extends string,
>(
  league: League<Id, ConferenceId>,
) =>
  Schema.Struct({
    id: Schema.Literal(league.id),
    conferenceId: Schema.Literals(league.conferences),
  });

export const SportLeague = Schema.Union([
  createLeagueSchema(nba),
  createLeagueSchema(nfl),
  createLeagueSchema(mlb),
  createLeagueSchema(nhl),
  createLeagueSchema(ncaam),
]).pipe(Schema.toTaggedUnion("id"));
export type SportLeague = typeof SportLeague.Type;

export const SportLeagueId = Schema.Literals(SportLeague.discriminants);
export type SportLeagueId = typeof SportLeagueId.Type;

export const SportTeamSubject = Schema.TaggedStruct("sports_team", {
  league: SportLeague,
  display: Schema.NonEmptyString,
  location: Schema.NonEmptyString,
  name: Schema.NonEmptyString,
  abbreviation: Schema.NonEmptyString,
  slug: Schema.optional(Schema.NonEmptyString),
});

export type SportTeamSubject = typeof SportTeamSubject.Type;
