import { Schema } from "effect";

export const SportLeagueIds = ["nba", "nfl", "mlb", "nhl", "ncaam"] as const;

export type SportLeagueId = typeof SportLeagueId.Type;
export const SportLeagueId = Schema.Literals(SportLeagueIds);

export const SportConferenceIds = [
  "east",
  "west",
  "afc",
  "nfc",
  "al",
  "nl",
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
] as const;

export type SportConferenceId = typeof SportConferenceId.Type;
export const SportConferenceId = Schema.Literals(SportConferenceIds);

export const SportConferences = [
  { id: "east", label: "Eastern Conference", leagueId: "nba" },
  { id: "west", label: "Western Conference", leagueId: "nba" },
  { id: "east", label: "Eastern Conference", leagueId: "nhl" },
  { id: "west", label: "Western Conference", leagueId: "nhl" },
  { id: "afc", label: "AFC", leagueId: "nfl" },
  { id: "nfc", label: "NFC", leagueId: "nfl" },
  { id: "al", label: "American League", leagueId: "mlb" },
  { id: "nl", label: "National League", leagueId: "mlb" },
  { id: "acc", label: "ACC", leagueId: "ncaam" },
  { id: "aac", label: "American", leagueId: "ncaam" },
  { id: "a10", label: "Atlantic 10", leagueId: "ncaam" },
  { id: "big-east", label: "Big East", leagueId: "ncaam" },
  { id: "big-ten", label: "Big Ten", leagueId: "ncaam" },
  { id: "big-12", label: "Big 12", leagueId: "ncaam" },
  { id: "mac", label: "MAC", leagueId: "ncaam" },
  { id: "mvc", label: "Missouri Valley", leagueId: "ncaam" },
  { id: "mountain-west", label: "Mountain West", leagueId: "ncaam" },
  { id: "pac-12", label: "Pac-12", leagueId: "ncaam" },
  { id: "sec", label: "SEC", leagueId: "ncaam" },
  { id: "wcc", label: "WCC", leagueId: "ncaam" },
] as const;

export const getSportConference = (
  leagueId: SportLeagueId,
  conferenceId: SportConferenceId,
) =>
  SportConferences.find(
    (conference) =>
      conference.id === conferenceId && conference.leagueId === leagueId,
  );

const SportTeamSubjectBase = Schema.TaggedStruct("sports_team", {
  leagueId: SportLeagueId,
  display: Schema.NonEmptyString,
  location: Schema.NonEmptyString,
  name: Schema.NonEmptyString,
  abbreviation: Schema.NonEmptyString,
  slug: Schema.optional(Schema.NonEmptyString),
  conferenceId: SportConferenceId,
});

export type SportTeamSubject = typeof SportTeamSubject.Type;
export const SportTeamSubject = SportTeamSubjectBase.check(
  Schema.makeFilter(function hasValidConference(details) {
    const conference = SportConferences.find(
      (candidate) =>
        candidate.id === details.conferenceId &&
        candidate.leagueId === details.leagueId,
    );

    if (!conference) return "Conference id does not belong to the subject's league";

    return undefined;
  }),
);
