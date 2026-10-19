import type { SportParticipant } from "../participants/variants/sport.schema.js";

type SubjectSide<Participant> = {
  readonly leading: Participant;
  readonly trailing: Participant;
  readonly separator: "@" | "vs.";
};

const normalize = (value: string) => value.trim().toLowerCase();

export const sportsSubjectSide = <
  Participant extends { readonly details: SportParticipant },
>(
  home: Participant,
  away: Participant,
  subjectDisplay: string,
): SubjectSide<Participant> | undefined => {
  const target = normalize(subjectDisplay);
  const isHome = normalize(home.details.title) === target;
  const isAway = normalize(away.details.title) === target;

  if (!isHome && !isAway) return undefined;

  return isHome
    ? { leading: home, trailing: away, separator: "vs." }
    : { leading: away, trailing: home, separator: "@" };
};
