import { StringParts } from "../../lib/string.js";
import type { SportTeamSubject } from "../subjects/variants/sport.schema.js";

/**
 * A headline tile: the brand's condensed display type pre-rendered onto an ink
 * panel. No Gmail client loads web fonts, and forced dark modes recolor text
 * but leave images alone, so an image is the only way the headline reads the
 * same in every inbox. The web app serves the PNGs; `pnpm --filter @dtpt/web
 * email:generate` renders one per spec below.
 */
export type EmailHeadline = {
  /** Path under the web root, without a leading slash. */
  readonly path: string;
  readonly first: string;
  /** Leads the second line, before the kelly accent. May be empty. */
  readonly second: string;
  readonly accent: string;
};

/** Size in CSS pixels. The PNGs are drawn at twice this for dense screens. */
export const EmailHeadlineSize = { width: 480, height: 192 } as const;

/** Gmail caches images by URL, so bump this whenever the artwork changes. */
const directory = "email/headlines/v1";

export const EmailHeadlines = {
  signIn: {
    path: `${directory}/sign-in.png`,
    first: "Your sign-in",
    second: "",
    accent: "link.",
  },
  confirmation: {
    path: `${directory}/confirmation.png`,
    first: "Confirm your",
    second: "",
    accent: "updates.",
  },
  nflKickoff: {
    path: `${directory}/nfl-kickoff.png`,
    first: "Football is",
    second: "",
    accent: "back.",
  },
  /** Catalog teams all carry a slug; one without it gets the text headline. */
  team: (team: SportTeamSubject): EmailHeadline | undefined =>
    team.slug === undefined
      ? undefined
      : {
          path: `${directory}/${team.leagueId}/${team.slug}.png`,
          first: team.name,
          second: "play",
          accent: "today.",
        },
} satisfies Record<
  string,
  EmailHeadline | ((team: SportTeamSubject) => EmailHeadline | undefined)
>;

export const buildEmailHeadlineUrl = (home: string, headline: EmailHeadline) =>
  StringParts().add(home.replace(/\/+$/, "")).add(headline.path).make("/");
