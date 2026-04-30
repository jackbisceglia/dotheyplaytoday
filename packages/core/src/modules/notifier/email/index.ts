import { DateTime, Effect, Layer, Match } from "effect";

import { domain } from "../../../lib/constants.js";
import type { Event, NonEmptyEvents } from "../../events/schema.js";
import type { User } from "../../users/schema.js";
import { Notifier } from "../index.js";
import { EmailProvider } from "./providers.js";

type EmailSection = {
  readonly matchup: string;
  readonly startTime: string;
};

const formatEventStart = (
  startUtc: Event["data"]["startUtc"],
  tz: User["timezone"],
) =>
  DateTime.format(DateTime.setZone(startUtc, tz), {
    locale: "en-US",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });

const formatEventMatchup = (event: Event["data"]) =>
  Match.value(event).pipe(
    Match.tags({
      sports: (sportsEvent) =>
        `${sportsEvent.teamName} ${sportsEvent.site === "home" ? "vs." : "@"} ${sportsEvent.opponent}`,
    }),
    Match.exhaustive,
  );

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const toSections = (user: User, events: NonEmptyEvents) =>
  events.map((event) => ({
    matchup: formatEventMatchup(event),
    startTime: formatEventStart(event.startUtc, user.timezone),
  })) as [EmailSection, ...EmailSection[]];

const formatSubject = (sections: readonly [EmailSection, ...EmailSection[]]) =>
  sections.length === 1
    ? `${sections[0].matchup} today at ${sections[0].startTime}`
    : `${sections[0].matchup} first today, plus ${(sections.length - 1).toString()} more`;

const formatText = (sections: readonly [EmailSection, ...EmailSection[]]) => {
  const [primary, ...rest] = sections;

  return [
    primary.matchup,
    primary.startTime,
    ...(rest.length === 0
      ? []
      : [
          "",
          "Also today:",
          ...rest.map(
            (section) => `- ${section.matchup}, ${section.startTime}`,
          ),
        ]),
  ].join("\n");
};

const formatHtml = (sections: readonly [EmailSection, ...EmailSection[]]) => {
  const [primary, ...rest] = sections;

  const additionalGames = rest
    .map(
      (section) =>
        `<li style="margin: 0 0 8px;">${escapeHtml(section.matchup)} - ${escapeHtml(section.startTime)}</li>`,
    )
    .join("");
  const homepageUrl = `https://${domain}`;

  // TODO: Move away from hardcoded HTML template literals here. A longer-term email
  // rendering format should make structure, reuse, and future evolution easier.
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; background-color: #ffffff;">
    <div style="max-width: 560px; border-left: 3px solid #15803d; padding: 4px 0 4px 16px; background-color: #ffffff;">
      <p style="margin: 0 0 10px; font-size: 11px; line-height: 1; letter-spacing: 0.08em; text-transform: uppercase; color: #15803d; font-weight: 700;">Game today</p>
      <p style="margin: 0 0 10px; font-size: 28px; line-height: 1.15; font-weight: 700; color: #111827;">${escapeHtml(primary.matchup)}</p>
      <p style="margin: 0;">
        <span style="display: inline-block; padding: 0; font-size: 15px; line-height: 1.5; font-weight: 600; color: #4b5563;">${escapeHtml(primary.startTime)}</span>
      </p>
      ${
        rest.length === 0
          ? ""
          : `<div style="margin-top: 18px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 8px; font-size: 13px; line-height: 1.5; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #6b7280;">Also today</p>
      <ul style="margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.5; color: #374151;">${additionalGames}</ul>
    </div>`
      }
      <p style="margin: 18px 0 0; padding-top: 12px; border-top: 1px solid #f3f4f6; font-size: 12px; line-height: 1.5; color: #9ca3af;"><a href="${homepageUrl}" style="color: #9ca3af; text-decoration: none;">dotheyplaytoday</a></p>
    </div>
  </body>
</html>`;
};

export const NotifierLayerEmail = Layer.effect(
  Notifier,
  Effect.gen(function* () {
    const emailProvider = yield* EmailProvider;

    const send = Effect.fn("Notifier.send")(function* (
      user: User,
      events: NonEmptyEvents,
    ) {
      const sections = toSections(user, events);

      yield* emailProvider.send({
        to: user.email,
        subject: formatSubject(sections),
        text: formatText(sections),
        html: formatHtml(sections),
      });
    });

    return Notifier.of({ send });
  }),
);
