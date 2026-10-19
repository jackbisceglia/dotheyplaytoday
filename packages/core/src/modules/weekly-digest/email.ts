import { Effect, Predicate } from "effect";

import { WebUrl } from "../../lib/config/web.js";
import { buildUnsubscribeUrl } from "../../lib/unsubscribe.js";
import { type Lines, makeTiledHeadline } from "../email/headline.js";
import { EmailView, Link, Links, ScheduleSection } from "../email/render.js";
import type { WeeklyDigest } from "./schema.js";
import { sportsSchedule } from "./sports.js";
import { mmaSchedule } from "./mma.js";

export const weeklyDigestLines: Lines = ["Your picks.", "This week."];

export const renderWeeklyDigest = Effect.fn("WeeklyDigest.render")(function* (
  digest: WeeklyDigest,
) {
  const web = yield* WebUrl;
  const unsubscribe = yield* buildUnsubscribeUrl(digest.user.unsubscribeToken);

  const sections = yield* Effect.forEach(digest.groups, (group) =>
    Effect.gen(function* () {
      const present = Predicate.isTagged(group.subject, "mma_tracking")
        ? mmaSchedule
        : sportsSchedule;
      const schedule = yield* present(group, digest.user.timezone);

      return ScheduleSection.make({
        ...schedule,
        emptyText: "No events this week.",
      });
    }),
  );

  return EmailView({
    subject: "Your Weekly Update",
    headline: makeTiledHeadline(web, weeklyDigestLines),
    preheader: "Here's what's coming up this week.",
    blocks: [
      ...sections,
      Links.make({
        items: [
          Link.make({
            href: `${web.replace(/\/+$/, "")}/home`,
            text: "Manage picks",
          }),
          Link.make({ href: unsubscribe, text: "Unsubscribe" }),
        ],
      }),
    ],
    metadata: { unsubscribe },
  });
});
