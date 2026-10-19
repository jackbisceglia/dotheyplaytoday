import { Predicate } from "effect";

import { type Subject, SubjectDetails } from "../subjects/schema.js";

const isSportsTeam = (subject: Subject) =>
  Predicate.isTagged(subject, "sports_team") &&
  SubjectDetails.guards.sports_team(subject.details);

const isMma = (subject: Subject) =>
  (Predicate.isTagged(subject, "mma_fighter") &&
    SubjectDetails.guards.mma_fighter(subject.details)) ||
  (Predicate.isTagged(subject, "mma_tracking") &&
    SubjectDetails.guards.mma_tracking(subject.details));

export const supportsWeeklyDigest = (subject: Subject): boolean =>
  isSportsTeam(subject) || isMma(subject);
