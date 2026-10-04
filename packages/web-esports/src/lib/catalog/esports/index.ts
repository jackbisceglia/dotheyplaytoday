import type { Participant } from "@dtpt/core/modules/events/participants/schema";
import type { EsportsParticipant } from "@dtpt/core/modules/events/participants/variants/esports.schema";
import type { EventWithParticipants } from "@dtpt/core/modules/events/service";
import type { EsportsMatch } from "@dtpt/core/modules/events/variants/esports.schema";
import type { Subject } from "@dtpt/core/modules/subjects/schema";
import type { EsportsTeamSubject } from "@dtpt/core/modules/subjects/variants/esports.schema";
import { Match } from "effect";

import { getCodLogo } from "./cod.js";

export type EsportsTeam = Omit<Subject, "details"> & {
  readonly details: EsportsTeamSubject;
};

export type EsportsMatchEvent = Omit<
  EventWithParticipants,
  "details" | "participants"
> & {
  readonly details: EsportsMatch;
  readonly participants: readonly (Omit<Participant, "details"> & {
    readonly details: EsportsParticipant;
  })[];
};

export const isEsportsTeam = (subject: Subject): subject is EsportsTeam =>
  subject.details._tag === "esports_team";

export const isEsportsMatch = (
  event: EventWithParticipants,
): event is EsportsMatchEvent =>
  event.details._tag === "esports_match" &&
  event.participants.every(
    (participant) => participant.details._tag === "esports_match",
  );

type Game = {
  readonly id: EsportsTeamSubject["gameId"];
  readonly label: string;
};

export const games = [
  { id: "cod", label: "COD" },
] as const satisfies readonly Game[];

export const getEsportsLogo = (details: EsportsTeamSubject) =>
  Match.value(details.gameId).pipe(
    Match.when("cod", () => getCodLogo(details.abbreviation)),
    Match.exhaustive,
  );

export const getTeams = (subjects: readonly EsportsTeam[]) =>
  subjects.toSorted((a, b) =>
    a.details.display.localeCompare(b.details.display),
  );
