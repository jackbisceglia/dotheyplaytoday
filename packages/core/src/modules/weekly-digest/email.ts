import { DateTime, Effect } from "effect";

import { WebUrl } from "../../lib/config/web.js";
import { buildUnsubscribeUrl } from "../../lib/unsubscribe.js";
import { type Lines, makeTiledHeadline } from "../email/headline.js";
import {
  EmailView,
  Link,
  Links,
  ScheduleSection,
  Text,
} from "../email/render.js";
import type { WeeklyDigest } from "./schema.js";
import { sportsSchedule } from "./sports.js";

export const weeklyDigestLines: Lines = ["Your teams.", "This week."];

export const renderWeeklyDigest = Effect.fn("WeeklyDigest.render")(function* (
  digest: WeeklyDigest,
) {
  const web = yield* WebUrl;
  const unsubscribe = yield* buildUnsubscribeUrl(digest.user.unsubscribeToken);
  const local = (instant: DateTime.Utc) =>
    DateTime.setZone(instant, digest.user.timezone);
  const start = local(digest.from);
  const end = DateTime.subtract(local(digest.to), { days: 1 });
  const dates = (date: DateTime.Zoned) =>
    DateTime.format(date, {
      locale: "en-US",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const first = DateTime.toParts(start);
  const last = DateTime.toParts(end);
  const month = (date: DateTime.Zoned) =>
    DateTime.format(date, { locale: "en-US", month: "long" });
  const dateRange =
    first.year !== last.year
      ? `${dates(start)} – ${dates(end)}`
      : first.month === last.month
        ? `${month(start)} ${first.day.toString()}–${last.day.toString()}`
        : `${month(start)} ${first.day.toString()} – ${month(end)} ${last.day.toString()}`;

  const sections = yield* Effect.forEach(digest.groups, (group) =>
    sportsSchedule(group, digest.user.timezone).pipe(
      Effect.map((schedule) =>
        ScheduleSection.make({
          ...schedule,
          emptyText: "No games this week.",
        }),
      ),
    ),
  );

  return EmailView({
    subject: "Your Weekly Update",
    headline: makeTiledHeadline(web, weeklyDigestLines),
    preheader: "Here's when your teams play.",
    blocks: [
      Text.make({ value: dateRange }),
      ...sections,
      Links.make({
        items: [
          Link.make({
            href: `${web.replace(/\/+$/, "")}/home`,
            text: "Manage teams",
          }),
          Link.make({ href: unsubscribe, text: "Unsubscribe" }),
        ],
      }),
    ],
    metadata: { unsubscribe },
  });
});
