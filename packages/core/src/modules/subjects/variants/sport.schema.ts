import { Schema } from "effect";

type SportConference = { readonly id: string; readonly label: string };

type SportLeagueDefinition = {
  readonly id: string;
  readonly label: string;
  readonly conferences: readonly SportConference[];
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

export type SportLeagueId = (typeof SportLeagueDefinitions)[number]["id"];
// lint(anti-slop/require-safety-comment-for-type-assertion): league ids are derived from the authoritative definitions.
export const SportLeagueIds = SportLeagueDefinitions.map(
  (league) => league.id,
) as readonly SportLeagueId[];
export const SportLeagueId = Schema.Literals(SportLeagueIds);

// lint(anti-slop/require-safety-comment-for-type-assertion): conference rows are derived from each league definition.
export const SportConferences = SportLeagueDefinitions.flatMap((league) =>
  league.conferences.map((conference) => ({
    id: conference.id,
    label: conference.label,
    leagueId: league.id,
  })),
) as readonly {
  readonly id: string;
  readonly label: string;
  readonly leagueId: SportLeagueId;
}[];

export type SportConferenceId = (typeof SportConferences)[number]["id"];
// lint(anti-slop/require-safety-comment-for-type-assertion): conference ids are derived from the authoritative definitions.
export const SportConferenceIds = SportConferences.map(
  (conference) => conference.id,
// lint(anti-slop/require-safety-comment-for-type-assertion): conference ids are derived from the authoritative definitions.
) as readonly SportConferenceId[];
export const SportConferenceId = Schema.Literals(SportConferenceIds);

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

const SportNbaTeamSubject = Schema.TaggedStruct("sports_team", {
  leagueId: Schema.Literal(SportLeagueDefinitions[0].id),
  conferenceId: Schema.Literals(
    // lint(anti-slop/require-safety-comment-for-type-assertion): conference IDs are derived from the authoritative league definition.
    SportLeagueDefinitions[0].conferences.map(
      (conference) => conference.id,
    ) as readonly (typeof SportLeagueDefinitions)[0]["conferences"][number]["id"][],
  ),
  ...commonSportTeamFields,
});

const SportNflTeamSubject = Schema.TaggedStruct("sports_team", {
  leagueId: Schema.Literal(SportLeagueDefinitions[1].id),
  conferenceId: Schema.Literals(
    // lint(anti-slop/require-safety-comment-for-type-assertion): conference IDs are derived from the authoritative league definition.
    SportLeagueDefinitions[1].conferences.map(
      (conference) => conference.id,
    ) as readonly (typeof SportLeagueDefinitions)[1]["conferences"][number]["id"][],
  ),
  ...commonSportTeamFields,
});

const SportMlbTeamSubject = Schema.TaggedStruct("sports_team", {
  leagueId: Schema.Literal(SportLeagueDefinitions[2].id),
  conferenceId: Schema.Literals(
    // lint(anti-slop/require-safety-comment-for-type-assertion): conference IDs are derived from the authoritative league definition.
    SportLeagueDefinitions[2].conferences.map(
      (conference) => conference.id,
    ) as readonly (typeof SportLeagueDefinitions)[2]["conferences"][number]["id"][],
  ),
  ...commonSportTeamFields,
});

const SportNhlTeamSubject = Schema.TaggedStruct("sports_team", {
  leagueId: Schema.Literal(SportLeagueDefinitions[3].id),
  conferenceId: Schema.Literals(
    // lint(anti-slop/require-safety-comment-for-type-assertion): conference IDs are derived from the authoritative league definition.
    SportLeagueDefinitions[3].conferences.map(
      (conference) => conference.id,
    ) as readonly (typeof SportLeagueDefinitions)[3]["conferences"][number]["id"][],
  ),
  ...commonSportTeamFields,
});

const SportNcaamTeamSubject = Schema.TaggedStruct("sports_team", {
  leagueId: Schema.Literal(SportLeagueDefinitions[4].id),
  conferenceId: Schema.Literals(
    // lint(anti-slop/require-safety-comment-for-type-assertion): conference IDs are derived from the authoritative league definition.
    SportLeagueDefinitions[4].conferences.map(
      (conference) => conference.id,
    ) as readonly (typeof SportLeagueDefinitions)[4]["conferences"][number]["id"][],
  ),
  ...commonSportTeamFields,
});

export const SportTeamSubject = Schema.Union([
  SportNbaTeamSubject,
  SportNflTeamSubject,
  SportMlbTeamSubject,
  SportNhlTeamSubject,
  SportNcaamTeamSubject,
]);

export type SportTeamSubject = typeof SportTeamSubject.Type;
