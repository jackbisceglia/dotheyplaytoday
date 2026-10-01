import { and, eq } from "drizzle-orm";
import { Context, DateTime, Effect, Layer, Schema } from "effect";

import {
  type DatabaseReadError,
  DatabaseWriteError,
  mapToReadError,
  mapToWriteError,
} from "../../lib/database/errors.js";
import { Database } from "../../lib/database/service.js";
import {
  WeeklyDigestDelivery,
  WeeklyDigestDeliveryInsert,
  weeklyDigestDeliveriesTable,
} from "./delivery-schema.js";

type DeliveryIdentity = Pick<WeeklyDigestDelivery, "userId" | "weekStart">;

export class WeeklyDigestDeliveries extends Context.Service<
  WeeklyDigestDeliveries,
  {
    readonly find: (
      input: DeliveryIdentity,
    ) => Effect.Effect<
      WeeklyDigestDelivery | undefined,
      DatabaseReadError | Schema.SchemaError
    >;
    readonly prepare: (
      input: WeeklyDigestDelivery,
    ) => Effect.Effect<
      WeeklyDigestDelivery,
      DatabaseReadError | DatabaseWriteError | Schema.SchemaError
    >;
    readonly markSent: (
      input: DeliveryIdentity & { readonly sentAt: DateTime.Utc },
    ) => Effect.Effect<void, DatabaseWriteError>;
  }
>()("@dtpt/core/WeeklyDigestDeliveries") {}

const decodeDelivery = Schema.decodeUnknownEffect(WeeklyDigestDelivery);
const encodeDelivery = Schema.encodeEffect(WeeklyDigestDeliveryInsert);

export const WeeklyDigestDeliveriesLayer = Layer.effect(
  WeeklyDigestDeliveries,
  Effect.gen(function* () {
    const database = yield* Database;
    const find: WeeklyDigestDeliveries["Service"]["find"] = Effect.fn(
      "WeeklyDigestDeliveries.find",
    )(function* (input) {
      const row = yield* database.query.weeklyDigestDeliveriesTable
        .findFirst({
          where: { userId: input.userId, weekStart: input.weekStart },
        })
        .pipe(mapToReadError("WeeklyDigestDeliveries.find", input));
      return row ? yield* decodeDelivery(row) : undefined;
    });

    return WeeklyDigestDeliveries.of({
      find,
      prepare: Effect.fn("WeeklyDigestDeliveries.prepare")(function* (input) {
        const row = yield* encodeDelivery(input);
        const identity = { userId: input.userId, weekStart: input.weekStart };
        // The first snapshot wins, including across overlapping cron invocations.
        yield* database
          .insert(weeklyDigestDeliveriesTable)
          .values(row)
          .onConflictDoNothing()
          .pipe(mapToWriteError("WeeklyDigestDeliveries.prepare", identity));
        const prepared = yield* find(identity);
        if (!prepared)
          return yield* new DatabaseWriteError({
            operation: "WeeklyDigestDeliveries.prepare",
            metadata: identity,
          });
        return prepared;
      }),
      markSent: Effect.fn("WeeklyDigestDeliveries.markSent")(function* (input) {
        const rows = yield* database
          .update(weeklyDigestDeliveriesTable)
          .set({ sentAt: DateTime.formatIso(input.sentAt) })
          .where(
            and(
              eq(weeklyDigestDeliveriesTable.userId, input.userId),
              eq(weeklyDigestDeliveriesTable.weekStart, input.weekStart),
            ),
          )
          .returning({ userId: weeklyDigestDeliveriesTable.userId })
          .pipe(
            mapToWriteError("WeeklyDigestDeliveries.markSent", {
              userId: input.userId,
              weekStart: input.weekStart,
            }),
          );
        if (rows.length === 0)
          return yield* new DatabaseWriteError({
            operation: "WeeklyDigestDeliveries.markSent",
            metadata: { userId: input.userId, weekStart: input.weekStart },
          });
      }),
    });
  }),
);
