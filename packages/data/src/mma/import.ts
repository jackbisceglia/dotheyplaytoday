import { Database, Subjects, Events, mapToTransactionError } from "@dtpt/core";
import {
  mapToReadError,
  mapToWriteError,
} from "@dtpt/core/lib/database/errors";
import { Event } from "@dtpt/core/modules/events/schema";
import type { MmaBout } from "@dtpt/core/modules/events/variants/mma.schema";
import { subjectEventsTable } from "@dtpt/core/modules/subjects/feed/schema";
import { SubjectId } from "@dtpt/core/modules/subjects/schema";
import { and, eq, inArray } from "drizzle-orm";
import { DateTime, Effect, Schema } from "effect";

import { ufcCoverageSubjects, UfcCoverageIds } from "./catalog.js";
import { MmaImport, type MmaImportInput } from "./schema.js";

export class InvalidMmaImport extends Schema.TaggedError<InvalidMmaImport>()(
  "InvalidMmaImport",
  { message: Schema.String },
) {}

const hasUniqueIds = (ids: readonly string[]) =>
  new Set(ids).size === ids.length;

export const reconcileBouts = (
  previous: readonly MmaBout[],
  incoming: readonly MmaBout[],
  complete: boolean,
): readonly MmaBout[] => {
  if (complete) return incoming;

  const merged = new Map(previous.map((bout) => [bout.id, bout]));
  for (const bout of incoming) {
    merged.set(bout.id, bout);
  }

  return [...merged.values()];
};

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
    !hasUniqueIds(data.cards.map((card) => card.sourceId)) ||
    data.cards.some(
      (card) => !hasUniqueIds(card.details.bouts.map((bout) => bout.id)),
    )
  ) {
    return yield* new InvalidMmaImport({
      message: "Duplicate fighter, card, source or bout identity",
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
          if (existing && existing._tag !== "mma_coverage") {
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
        for (const card of data.cards) {
          const existing = yield* database.query.eventsTable
            .findFirst({ where: { _tag: "mma_card", sourceId: card.sourceId } })
            .pipe(mapToReadError("Mma.card"));
          const previous = existing
            ? yield* Schema.decodeUnknownEffect(Event)(existing)
            : undefined;
          if (previous && previous.id !== card.id) {
            return yield* new InvalidMmaImport({
              message: "Source identity must retain its allocated card ID",
            });
          }
          if (
            previous?.details._tag === "mma_card" &&
            DateTime.isGreaterThan(
              previous.details.reviewedAt,
              card.details.reviewedAt,
            )
          ) {
            continue;
          }
          const bouts = reconcileBouts(
            previous?.details._tag === "mma_card" ? previous.details.bouts : [],
            card.details.bouts,
            card.boutsComplete,
          );
          const activeFighters = bouts
            .filter((bout) => bout.status === "scheduled")
            .flatMap((bout) => bout.fighters);
          if (
            !hasUniqueIds(activeFighters.map((fighter) => fighter.subjectId))
          ) {
            return yield* new InvalidMmaImport({
              message:
                "A fighter cannot occupy multiple active slots on a card",
            });
          }
          for (const fighter of bouts.flatMap((bout) => bout.fighters)) {
            const subject = yield* database.query.subjectsTable
              .findFirst({ where: { id: fighter.subjectId } })
              .pipe(mapToReadError("Mma.boutFighter"));
            if (subject?._tag !== "mma_fighter") {
              return yield* new InvalidMmaImport({
                message: "Bout references an unknown fighter",
              });
            }
          }
          const details = { ...card.details, bouts };
          const event = yield* events.upsert({
            id: card.id,
            sourceId: card.sourceId,
            _tag: "mma_card",
            startsAt: card.startsAt,
            availability: card.availability,
            details,
          });
          // Only UFC-owned edges for this specific imported card are authoritative.
          const mmaSubjects = yield* database.query.subjectsTable
            .findMany({
              where: { _tag: { in: ["mma_fighter", "mma_coverage"] } },
            })
            .pipe(mapToReadError("Mma.subjects"));
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
          const matched = new Set<SubjectId>(
            activeFighters.map((fighter) => fighter.subjectId),
          );
          matched.add(UfcCoverageIds.all);
          if (details.kind === "numbered") matched.add(UfcCoverageIds.numbered);
          for (const subjectId of matched) {
            yield* subjects.addEventToFeed({ eventId: event.id, subjectId });
          }
        }
      }),
    )
    .pipe(mapToTransactionError("DataSeed.seedMmaCatalog"));
});
