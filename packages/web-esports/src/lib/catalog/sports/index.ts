import type { Participant } from "@dtpt/core/modules/events/participants/schema";
import type { SportParticipant } from "@dtpt/core/modules/events/participants/variants/sport.schema";
import type { EventWithParticipants } from "@dtpt/core/modules/events/service";
import type { SportEvent } from "@dtpt/core/modules/events/variants/sport.schema";
import type { Subject } from "@dtpt/core/modules/subjects/schema";
import type { SportTeamSubject } from "@dtpt/core/modules/subjects/variants/sport.schema";
import { Match } from "effect";

import { getMlbLogo } from "./mlb.js";
import { getNbaLogo } from "./nba.js";
import { getNflLogo } from "./nfl.js";
import { getNhlLogo } from "./nhl.js";

export type SportsTeam = Omit<Subject, "details"> & {
  readonly details: SportTeamSubject;
};

export type SportsGame = Omit<
  EventWithParticipants,
  "details" | "participants"
> & {
  readonly details: SportEvent;
  readonly participants: readonly (
    Omit<Participant, "details"> & { readonly details: SportParticipant }
  )[];
};

export const isSportsTeam = (subject: Subject): subject is SportsTeam =>
  subject.details._tag === "sports_team";

export const isSportsGame = (
  event: EventWithParticipants,
): event is SportsGame =>
  event.details._tag === "sports_game" &&
  event.participants.every(
    (participant) => participant.details._tag === "sports_game",
  );

type League = {
  readonly id: SportTeamSubject["leagueId"];
  readonly label: string;
};

export const leagues = [
  { id: "nba", label: "NBA" },
  { id: "nfl", label: "NFL" },
  { id: "mlb", label: "MLB" },
  { id: "nhl", label: "NHL" },
] as const satisfies readonly League[];

export const getSportsLogo = (details: SportTeamSubject) =>
  Match.value(details.leagueId).pipe(
    Match.when("nba", () => getNbaLogo(details.abbreviation)),
    Match.when("nfl", () => getNflLogo(details.abbreviation)),
    Match.when("mlb", () => getMlbLogo(details.abbreviation)),
    Match.when("nhl", () => getNhlLogo(details.abbreviation)),
    Match.exhaustive,
  );

export const getTeams = (subjects: readonly SportsTeam[]) =>
  subjects.toSorted((a, b) =>
    a.details.display.localeCompare(b.details.display),
  );
