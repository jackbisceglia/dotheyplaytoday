import { DateTime, Effect, Schema } from "effect";

import { WebUrl } from "../../lib/config/web.js";
import { buildUnsubscribeUrl } from "../../lib/unsubscribe.js";
import { makeTiledHeadline } from "../email/headline.js";
import { EmailView, Link, Links, Matchups } from "../email/render.js";
import { EventId } from "../events/schema.js";
import type { User } from "../users/schema.js";
import type { Edition, EditionGame } from "./edition.js";

export class EditionRenderError extends Schema.TaggedError<EditionRenderError>()(
  "EditionRenderError",
  { eventId: EventId, message: Schema.String },
) {}

const startTime = (game: EditionGame, timezone: User["timezone"]) =>
  DateTime.format(DateTime.setZone(game.startsAt, timezone), {
    locale: "en-US",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });

const matchup = Effect.fn("Edition.matchup")(function* (
  game: EditionGame,
  timezone: User["timezone"],
) {
  const home = game.participants.find((p) => p.details.role === "home");
  const away = game.participants.find((p) => p.details.role === "away");

  if (!home || !away) {
    return yield* new EditionRenderError({
      eventId: game.id,
      message: "Expected one home and one away participant",
    });
  }

  return {
    leading: away.details.title,
    separator: "@",
    trailing: home.details.title,
    detail: startTime(game, timezone),
  };
});

/** The whole slate, in kickoff order and the recipient's own timezone. */
export const renderEdition = Effect.fn("Edition.render")(function* (
  edition: Edition,
  user: User,
  games: readonly EditionGame[],
) {
  const web = yield* WebUrl;
  const unsubscribe = yield* buildUnsubscribeUrl(user.unsubscribeToken);

  const items = yield* Effect.forEach(games, (game) =>
    matchup(game, user.timezone),
  );

  return EmailView({
    subject: edition.presentation.subject,
    headline: makeTiledHeadline(web, edition.presentation.lines),
    blocks: [
      Matchups.make({ items }),
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
