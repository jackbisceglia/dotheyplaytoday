import { Schema } from "effect";

type SportConference<Id extends string = string> = {
  readonly id: Id;
  readonly label: string;
};

type SportLeagueDefinition<
  Id extends string = string,
  ConferenceId extends string = string,
> = {
  readonly id: Id;
  readonly label: string;
  readonly conferences: readonly SportConference<ConferenceId>[];
};

export const SportLeagueDefinitions = [
  {
    id: "nba",
    label: "NBA",
    conferences: [
      { id: "east", label: "Eastern Conference" },
      { id: "west", label: "Western Conference" },
    ],
  },
  {
    id: "nfl",
    label: "NFL",
    conferences: [
      { id: "afc", label: "AFC" },
      { id: "nfc", label: "NFC" },
    ],
  },
  {
    id: "mlb",
    label: "MLB",
    conferences: [
      { id: "al", label: "American League" },
      { id: "nl", label: "National League" },
    ],
  },
  {
    id: "nhl",
    label: "NHL",
    conferences: [
      { id: "east", label: "Eastern Conference" },
      { id: "west", label: "Western Conference" },
    ],
  },
  {
    id: "ncaam",
    label: "NCAA MBB",
    conferences: [
      { id: "acc", label: "ACC" },
      { id: "aac", label: "American" },
      { id: "a10", label: "Atlantic 10" },
      { id: "big-east", label: "Big East" },
      { id: "big-ten", label: "Big Ten" },
      { id: "big-12", label: "Big 12" },
      { id: "mac", label: "MAC" },
      { id: "mvc", label: "Missouri Valley" },
      { id: "mountain-west", label: "Mountain West" },
      { id: "pac-12", label: "Pac-12" },
      { id: "sec", label: "SEC" },
      { id: "wcc", label: "WCC" },
    ],
  },
] as const satisfies readonly SportLeagueDefinition[];

export const SportLeagueIds = SportLeagueDefinitions.map((league) => league.id);
export const SportLeagueId = Schema.Literals(SportLeagueIds);
export type SportLeagueId = typeof SportLeagueId.Type;

export const SportConferences = SportLeagueDefinitions.flatMap((league) =>
  league.conferences.map((conference) => ({
    id: conference.id,
    label: conference.label,
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

const commonSportTeamFields = {
  display: Schema.NonEmptyString,
  location: Schema.NonEmptyString,
  name: Schema.NonEmptyString,
  abbreviation: Schema.NonEmptyString,
  slug: Schema.optional(Schema.NonEmptyString),
} as const;

const sportTeamSchema = <
  const Id extends string,
  const ConferenceId extends string,
>(
  league: SportLeagueDefinition<Id, ConferenceId>,
) =>
  Schema.TaggedStruct("sports_team", {
    leagueId: Schema.Literal(league.id),
    conferenceId: Schema.Literals(
      league.conferences.map((conference) => conference.id),
    ),
    ...commonSportTeamFields,
  });

const [nba, nfl, mlb, nhl, ncaam] = SportLeagueDefinitions;

export const SportTeamSubject = Schema.Union([
  sportTeamSchema(nba),
  sportTeamSchema(nfl),
  sportTeamSchema(mlb),
  sportTeamSchema(nhl),
  sportTeamSchema(ncaam),
]).pipe(Schema.toTaggedUnion("leagueId"));

export type SportTeamSubject = typeof SportTeamSubject.Type;
