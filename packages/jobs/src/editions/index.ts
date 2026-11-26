import {
  type Edition,
  editionGate,
  editionIdempotencyKey,
  editionRange,
  isEditionCronTick,
  selectEditionGames,
  selectEditionRecipients,
} from "@dtpt/core/modules/editions/edition";
import { Editions } from "@dtpt/core/modules/editions/catalog";
import { renderEdition } from "@dtpt/core/modules/editions/email";
import { Email } from "@dtpt/core/modules/email/service";
import { Events } from "@dtpt/core/modules/events/service";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
import { EmailAddressFromString } from "@dtpt/core/modules/users/schema";
import { Array, DateTime, Effect, Schema } from "effect";

export type EditionOptions = typeof EditionOptions.Type;
export const EditionOptions = Schema.Struct({
  edition: Schema.String,
  dryRun: Schema.Boolean.pipe(
    Schema.withDecodingDefault(Effect.succeed(false)),
  ),
  userEmail: Schema.optional(EmailAddressFromString),
  now: Schema.optional(Schema.DateTimeUtcFromString),
});

/**
 * Live runs only proceed inside the edition's send window, so a late or
 * repeated trigger cannot send. Dry runs always render, and report the gate.
 */
export const sendEdition = Effect.fn("EditionJob")(function* (
  edition: Edition,
  opts: Omit<EditionOptions, "edition">,
) {
  const now = opts.now ?? (yield* DateTime.now);
  const gate = editionGate(edition, now);
  const log = { edition: edition.id, now: DateTime.formatIso(now) };

  if (gate._tag === "closed") {
    yield* Effect.logWarning("edition: send window has passed", {
      ...log,
      closesAt: DateTime.formatIso(edition.send.closesAt),
    });
  }

  if (!opts.dryRun && gate._tag !== "open") {
    yield* Effect.logWarning("edition: live send refused outside window", {
      ...log,
      gate: gate._tag,
    });

    return;
  }

  const subscriptions = yield* Subscriptions;
  const events = yield* Events;

  const users = selectEditionRecipients(
    edition,
    yield* subscriptions.listNotificationRecipients(),
  ).filter((user) => !opts.userEmail || user.email === opts.userEmail);
  const games = selectEditionGames(
    edition,
    yield* events.listByRange(editionRange(edition)),
  );

  yield* Effect.logInfo("edition: selected", {
    ...log,
    dryRun: opts.dryRun,
    gate: gate._tag,
    recipients: users.length,
    games: games.map((game) => game.id),
  });

  if (!Array.isReadonlyArrayNonEmpty(games)) {
    return yield* Effect.logError("edition: no games; nothing sent", log);
  }

  yield* Effect.forEach(
    users,
    Effect.fn("EditionJob.user")(
      function* (user) {
        const identity = {
          userId: user.id,
          idempotencyKey: editionIdempotencyKey(edition, user),
        };
        const rendered = yield* renderEdition(edition, user, games);

        if (opts.dryRun) {
          return yield* Effect.logInfo("edition: dry-run", {
            ...identity,
            subject: rendered.subject,
            text: rendered.body.text,
          });
        }

        const email = yield* Email;

        yield* email.send(
          { recipient: user.email, idempotencyKey: identity.idempotencyKey },
          rendered,
        );

        yield* Effect.logInfo("edition: sent", identity);
      },
      Effect.catchTags({
        EditionRenderError: (error) =>
          Effect.logError("edition: invalid game", error),
        EmailRequestError: (error) =>
          Effect.logError("edition: delivery failed", error),
        EmailResponseError: (error) =>
          Effect.logError("edition: delivery rejected", error),
      }),
      (effect, user) => effect.pipe(Effect.annotateLogs({ userId: user.id })),
    ),
  );
});

/** Runs any edition whose cron mode is on at its single scheduled tick. */
export const scheduledEditions = Effect.fn("EditionJob.scheduled")(function* (
  now: DateTime.Utc,
  editions: readonly Edition[] = Editions,
) {
  for (const edition of editions) {
    if (edition.send.cron === "off" || !isEditionCronTick(edition, now))
      continue;

    yield* Effect.logInfo("edition: scheduled tick", {
      edition: edition.id,
      mode: edition.send.cron,
    });
    yield* sendEdition(edition, { now, dryRun: edition.send.cron !== "live" });
  }
});
