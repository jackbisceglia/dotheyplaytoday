import { Database, Subjects, Events, mapToTransactionError } from "@dtpt/core";
import {
  mapToReadError,
  mapToWriteError,
} from "@dtpt/core/lib/database/errors";
import { subjectEventsTable } from "@dtpt/core/modules/subjects/feed/schema";
import { and, eq, inArray } from "drizzle-orm";
import { Array, Effect, Schema } from "effect";

import { ufcCoverageSubjects, UfcCoverageIds } from "./catalog.js";
import { MmaImport, type MmaImportInput } from "./schema.js";

export class InvalidMmaImport extends Schema.TaggedError<InvalidMmaImport>()(
  "InvalidMmaImport",
  { message: Schema.String },
) {}

const hasUniqueIds = (ids: readonly string[]) =>
  new Set(ids).size === ids.length;

export const seedMmaCatalog = Effect.fn("DataSeed.seedMmaCatalog")(function* (
  input: MmaImportInput,
) {
  const data = yield* Schema.decodeUnknownEffect(MmaImport)(input);
  const database = yield* Database;
  const subjects = yield* Subjects;
  const events = yield* Events;
  if (
    !hasUniqueIds(data.fighters.map((fighter) => fighter.id)) ||
    !hasUniqueIds(data.cards.map((card) => card.id)) ||
    !hasUniqueIds(data.cards.map((card) => card.sourceId))
  ) {
    return yield* new InvalidMmaImport({
      message: "Duplicate fighter, card or source identity",
    });
  }
  for (const card of data.cards) {
    if (!card.sourceUrl.startsWith("https://www.ufc.com/")) {
      return yield* new InvalidMmaImport({
        message: "Cards require an official UFC source",
      });
    }
  }

  yield* database
    .transaction(() =>
      Effect.gen(function* () {
        // These fixed rows also serialize concurrent UFC catalog imports.
        for (const coverage of ufcCoverageSubjects) {
          const existing = yield* database.query.subjectsTable
            .findFirst({ where: { id: coverage.id } })
            .pipe(mapToReadError("Mma.coverage"));
          if (existing && existing._tag !== "mma_tracking") {
            return yield* new InvalidMmaImport({
              message: "Coverage ID belongs to another subject",
            });
          }
          yield* subjects.upsert(coverage);
        }
        for (const fighter of data.fighters) {
          const existing = yield* database.query.subjectsTable
            .findFirst({ where: { id: fighter.id } })
            .pipe(mapToReadError("Mma.fighter"));
          if (existing && existing._tag !== "mma_fighter") {
            return yield* new InvalidMmaImport({
              message: "Fighter ID belongs to another subject",
            });
          }
          yield* subjects.upsert({ ...fighter, _tag: "mma_fighter" });
        }
        const mmaSubjects = yield* database.query.subjectsTable
          .findMany({
            where: { _tag: { in: ["mma_fighter", "mma_tracking"] } },
          })
          .pipe(mapToReadError("Mma.subjects"));
        const fighterIds = new Set(
          mmaSubjects
            .filter((subject) => subject._tag === "mma_fighter")
            .map((subject) => subject.id),
        );
        for (const card of data.cards) {
          const existing = yield* database.query.eventsTable
            .findFirst({ where: { _tag: "mma_card", sourceId: card.sourceId } })
            .pipe(mapToReadError("Mma.card"));
          if (existing && existing.id !== card.id) {
            return yield* new InvalidMmaImport({
              message: "Source identity must retain its allocated card ID",
            });
          }
          const fighters = card.participants.map(
            (participant) => participant.details,
          );
          if (!hasUniqueIds(fighters.map((fighter) => fighter.subjectId))) {
            return yield* new InvalidMmaImport({
              message: "A fighter cannot occupy multiple slots on a card",
            });
          }
          if (fighters.some((fighter) => !fighterIds.has(fighter.subjectId))) {
            return yield* new InvalidMmaImport({
              message: "Fight references an unknown fighter",
            });
          }
          if (
            Object.values(
              Array.groupBy(fighters, (fighter) => fighter.fightId),
            ).some(
              (fight) =>
                fight.length > 2 ||
                fight.some(
                  (fighter) => fighter.placement !== fight[0].placement,
                ),
            )
          ) {
            return yield* new InvalidMmaImport({
              message:
                "Each fight requires one or two participants with matching placement",
            });
          }
          const event = yield* events.upsert({
            id: card.id,
            sourceId: card.sourceId,
            _tag: "mma_card",
            startsAt: card.startsAt,
            availability: card.availability,
            details: card.details,
          });
          yield* events.setParticipants(event.id, card.participants);
          // Only UFC-owned edges for this specific imported card are authoritative.
          yield* database
            .delete(subjectEventsTable)
            .where(
              and(
                eq(subjectEventsTable.eventId, event.id),
                inArray(
                  subjectEventsTable.subjectId,
                  mmaSubjects.map((subject) => subject.id),
                ),
              ),
            )
            .pipe(mapToWriteError("Mma.reconcileFeed"));
          const matched = [
            UfcCoverageIds.all,
            ...fighters.map((fighter) => fighter.subjectId),
          ];
          if (card.details.category === "numbered")
            matched.push(UfcCoverageIds.numbered);
          for (const subjectId of matched) {
            yield* subjects.addEventToFeed({ eventId: event.id, subjectId });
          }
        }
      }),
    )
    .pipe(mapToTransactionError("DataSeed.seedMmaCatalog"));
});
