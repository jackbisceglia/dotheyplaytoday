import * as PgClient from "@effect/sql-pg/PgClient";
import { describe, expect, it } from "@effect/vitest";
import * as Drizzle from "drizzle-orm/effect-postgres";
import { DateTime, Effect, Layer, Stream } from "effect";
import { Reactivity } from "effect/unstable/reactivity";
import type { Connection } from "effect/unstable/sql/SqlConnection";
import { vi } from "vitest";

import { relations } from "../../../lib/database/definitions/relations.js";
import { Database } from "../../../lib/database/service.js";
import { type WeeklyDigestDelivery } from "../delivery-schema.js";
import {
  WeeklyDigestDeliveries,
  WeeklyDigestDeliveriesLayer,
} from "../service.js";
import { digest } from "./fixtures.js";

const rendered = {
  subject: "Saved snapshot",
  body: { text: "original", html: "<p>original</p>" },
};
const delivery: WeeklyDigestDelivery = {
  userId: digest.user.id,
  weekStart: "2026-10-05",
  rendered,
  sentAt: null,
};

// Real Drizzle and Effect SQL with a fake driver, following Users service tests.
// This exercises SQL shape and persisted decoding, not PostgreSQL concurrency.
const fixture = () => {
  const execute = vi.fn<Connection["executeValues"]>(() => Effect.succeed([]));
  const connection: Connection = {
    executeValues: execute,
    executeValuesUnprepared: execute,
    execute: () => Effect.die("Unexpected object query"),
    executeRaw: execute,
    executeUnprepared: () => Effect.die("Unexpected unprepared query"),
    executeStream: () => Stream.die("Unexpected stream"),
  };
  const database = Layer.effect(
    Database,
    Effect.gen(function* () {
      const client = yield* PgClient.makeWith({
        acquirer: Effect.succeed(connection),
        transactionAcquirer: Effect.succeed(connection),
        listenAcquirer: Effect.die("Unexpected LISTEN"),
        config: {},
      });
      return yield* Drizzle.makeWithDefaults({ relations }).pipe(
        Effect.provideService(PgClient.PgClient, client),
      );
    }).pipe(Effect.provide(Reactivity.layer)),
  );
  return {
    execute,
    layer: WeeklyDigestDeliveriesLayer.pipe(Layer.provide(database)),
  };
};

describe("weekly digest delivery persistence", () => {
  it.effect(
    "returns the winning snapshot after insert conflict instead of replacing it",
    () => {
      const f = fixture();
      f.execute
        .mockReturnValueOnce(Effect.succeed([]))
        .mockReturnValueOnce(
          Effect.succeed([
            [delivery.userId, delivery.weekStart, rendered, null],
          ]),
        );
      return Effect.gen(function* () {
        const service = yield* WeeklyDigestDeliveries;
        const saved = yield* service.prepare({
          ...delivery,
          rendered: { ...rendered, subject: "changed" },
        });
        expect(saved.rendered.subject).toBe("Saved snapshot");
        expect(f.execute.mock.calls[0]?.[0]).toContain(
          "on conflict do nothing",
        );
        expect(f.execute.mock.calls[0]?.[0]).not.toContain("do update");
        expect(f.execute.mock.calls[1]?.[1]).toContain(delivery.userId);
        expect(f.execute.mock.calls[1]?.[1]).toContain(delivery.weekStart);
      }).pipe(Effect.provide(f.layer));
    },
  );

  it.effect("returns undefined for a week without a snapshot", () => {
    const f = fixture();
    return Effect.gen(function* () {
      const service = yield* WeeklyDigestDeliveries;
      expect(yield* service.find(delivery)).toBeUndefined();
    }).pipe(Effect.provide(f.layer));
  });

  it.effect(
    "rejects a malformed persisted email rather than treating it as delivered",
    () => {
      const f = fixture();
      f.execute.mockReturnValue(
        Effect.succeed([
          [delivery.userId, delivery.weekStart, { subject: 42 }, null],
        ]),
      );
      return Effect.gen(function* () {
        const service = yield* WeeklyDigestDeliveries;
        const error = yield* service.find(delivery).pipe(Effect.flip);
        expect(error._tag).toBe("SchemaError");
      }).pipe(Effect.provide(f.layer));
    },
  );

  it.effect("records success only for the selected user and week", () => {
    const f = fixture();
    f.execute.mockReturnValue(Effect.succeed([[delivery.userId]]));
    return Effect.gen(function* () {
      const service = yield* WeeklyDigestDeliveries;
      yield* service.markSent({
        ...delivery,
        sentAt: DateTime.makeUnsafe("2026-10-05T13:00:00Z"),
      });
      expect(f.execute.mock.calls[0]?.[0]).toMatch(
        /^update "weekly_digest_deliveries"/,
      );
      expect(f.execute.mock.calls[0]?.[1]).toEqual([
        "2026-10-05T13:00:00.000Z",
        delivery.userId,
        delivery.weekStart,
      ]);
    }).pipe(Effect.provide(f.layer));
  });

  it.effect(
    "reports a write failure if the delivery disappeared before marking sent",
    () => {
      const f = fixture();
      return Effect.gen(function* () {
        const service = yield* WeeklyDigestDeliveries;
        const error = yield* service
          .markSent({
            ...delivery,
            sentAt: DateTime.makeUnsafe("2026-10-05T13:00:00Z"),
          })
          .pipe(Effect.flip);
        expect(error._tag).toBe("DatabaseWriteError");
      }).pipe(Effect.provide(f.layer));
    },
  );
});
