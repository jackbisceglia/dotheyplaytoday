import { sportsTeamSubjects } from "./catalog/sports.js";

type CoreFixedSchedule = import("@dtpt/core-v2").FixedSchedule;
type CoreSubjectDetails = import("@dtpt/core-v2").SubjectDetails;

export type SportsTeamDetails = Extract<
  CoreSubjectDetails,
  { readonly _tag: "sports_team" }
>;

export type Subject = {
  readonly id: string;
  readonly _tag: SportsTeamDetails["_tag"];
  readonly details: SportsTeamDetails;
};

type SubjectTag = Subject["details"]["_tag"];

export type SubjectsByTag = {
  readonly [Tag in SubjectTag]: readonly Extract<
    Subject,
    { readonly _tag: Tag }
  >[];
};

export type SignupFormData = {
  readonly subjects: SubjectsByTag;
};

export type FixedSchedule = {
  readonly _tag: CoreFixedSchedule["_tag"];
  readonly sendAtSecondsLocal: number;
};

export type SignupInput = {
  readonly email: string;
  readonly timezone: string;
  readonly schedule: FixedSchedule;
  readonly subjectIds: readonly Subject["id"][];
};

export type SignupResult = { readonly ok: true };

const MOCK_LATENCY_MS = 350;
const MOCK_FAILURE_EMAIL_MARKER = "+fail";

// TODO: import this from the core contract once signup constraints are public.
export const SUBJECT_CAP = 2;

const mockSignupFormData = {
  subjects: {
    sports_team: sportsTeamSubjects,
  },
} satisfies SignupFormData;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getSignupFormData = (): SignupFormData => mockSignupFormData;

export const api = {
  subjects: {
    async list(): Promise<SubjectsByTag> {
      await delay(MOCK_LATENCY_MS);
      return mockSignupFormData.subjects;
    },
  },
  signup: {
    async submit(input: SignupInput): Promise<SignupResult> {
      await delay(MOCK_LATENCY_MS * 2);
      if (input.email.includes(MOCK_FAILURE_EMAIL_MARKER)) {
        throw new Error("mock signup failure");
      }
      return { ok: true };
    },
  },
};
