import { makeDatabaseLayer } from "./database.js";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import { Effect, Layer } from "effect";
import { describe, expect, it, onTestFinished } from "vitest";

import { Id } from "@dtpt/core/lib/id/service";
import { Billing, BillingLayer } from "@dtpt/core/modules/billing/service";
import { SubjectId } from "@dtpt/core/modules/subjects/schema";
import {
  Subscriptions,
  SubscriptionsLayer,
} from "@dtpt/core/modules/subscriptions/service";
import { UserId } from "@dtpt/core/modules/users/schema";
import { Users, UsersLayer } from "@dtpt/core/modules/users/service";

const existingId = UserId.make("00000000-0000-4000-8000-000000000001");
const newId = UserId.make("00000000-0000-4000-8000-000000000002");
const schedule = {
  _tag: "fixed_local_time",
  sendAtSecondsLocal: 32400,
} as const;

const makeFixture = async () => {
  const database = new PGlite();
  onTestFinished(() => database.close());
  for (const name of ["0001_initial.sql", "0004_better_auth.sql"]) {
    await database.exec(
      await readFile(
        new URL(
          `../../../../data/migrations/postgres/${name}`,
          import.meta.url,
        ),
        "utf8",
      ),
    );
  }
  await database.query(
    "INSERT INTO users (id, email, timezone, unsubscribe_token, email_verified) VALUES ($1, 'existing@example.com', 'America/New_York', $1, true)",
    [existingId],
  );
  await database.exec(
    await readFile(
      new URL(
        "../../../../data/migrations/postgres/0006_pro_billing.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  await database.query(
    "INSERT INTO users (id, email, timezone, unsubscribe_token, email_verified) VALUES ($1, 'new@example.com', 'America/New_York', $1, true)",
    [newId],
  );
  const teamIds = Array.from({ length: 6 }, () => SubjectId.make(randomUUID()));
  for (const [index, id] of teamIds.entries()) {
    await database.query(
      "INSERT INTO subjects (id, _tag, details) VALUES ($1, 'sports_team', $2)",
      [
        id,
        JSON.stringify({
          _tag: "sports_team",
          leagueId: "nba",
          display: `Team ${String(index)}`,
          location: "Test",
          name: `Team ${String(index)}`,
          abbreviation: "TST",
        }),
      ],
    );
  }
  const databaseLayer = makeDatabaseLayer(database);
  const layer = Layer.mergeAll(
    UsersLayer,
    BillingLayer,
    SubscriptionsLayer,
  ).pipe(
    Layer.provide([
      databaseLayer,
      Layer.mock(Id, {
        makeFromBrandedSchema: (schema) =>
          Effect.succeed(schema.make(randomUUID())),
      }),
    ]),
  );
  const run = <A, E>(
    effect: Effect.Effect<A, E, Users | Billing | Subscriptions>,
  ) => Effect.runPromise(effect.pipe(Effect.provide(layer)));
  const setPaid = async (status = "active", periodEnd = "2100-01-01") => {
    await database.query(
      "UPDATE users SET stripe_customer_id = 'cus_test' WHERE id = $1",
      [newId],
    );
    await database.query(
      "INSERT INTO billing_subscriptions (id, plan, user_id, stripe_customer_id, stripe_subscription_id, status, period_start, period_end) VALUES ('billing', 'pro', $1, 'cus_test', 'sub_test', $2, '2026-09-01', $3)",
      [newId, status, periodEnd],
    );
  };
  const replace = (userId: UserId, count: number) =>
    Effect.gen(function* () {
      const users = yield* Users;
      const subscriptions = yield* Subscriptions;
      const ids = teamIds.slice(0, count);
      const [first, ...rest] = ids;
      if (!first) throw new Error("Missing team");
      return yield* subscriptions.replaceForUser({
        user: yield* users.get(userId),
        subjectIds: [first, ...rest],
        schedule,
      });
    });
  return { database, teamIds, run, setPaid, replace };
};

describe("billing persistence and team enforcement", () => {
  it("allows only one pending checkout record per account", async () => {
    const f = await makeFixture();
    const insert = (id: string) =>
      f.database.query(
        "INSERT INTO billing_subscriptions (id, plan, user_id) VALUES ($1, 'pro', $2)",
        [id, newId],
      );
    await insert("checkout-1");
    await expect(insert("checkout-2")).rejects.toMatchObject({
      code: "23505",
      constraint: "billing_subscriptions_pending_checkout_idx",
    });
    expect(
      (await f.database.query("SELECT * FROM billing_subscriptions")).rows,
    ).toHaveLength(1);
  });

  it("grandfathers precisely the users present at migration time", async () => {
    const f = await makeFixture();
    const rows = (
      await f.database.query<{ id: string; grandfathered_pro: boolean }>(
        "SELECT id, grandfathered_pro FROM users ORDER BY id",
      )
    ).rows;
    expect(rows).toEqual([
      { id: existingId, grandfathered_pro: true },
      { id: newId, grandfathered_pro: false },
    ]);
    await f.run(f.replace(existingId, 6));
    const rejected = await f.run(f.replace(newId, 3).pipe(Effect.flip));
    expect(rejected).toMatchObject({
      _tag: "SubjectCapacityReached",
      limit: 2,
      received: 3,
    });
    expect(
      (
        await f.database.query(
          "SELECT * FROM subscriptions WHERE user_id = $1",
          [newId],
        )
      ).rows,
    ).toHaveLength(0);
  });

  it("enforces the current entitlement even when a caller holds a stale Pro user", async () => {
    const f = await makeFixture();
    await f.setPaid();
    await f.run(f.replace(newId, 6));
    const user = await f.run(
      Effect.flatMap(Users, (users) => users.get(newId)),
    );
    await f.database.exec(
      "UPDATE billing_subscriptions SET status = 'canceled'",
    );
    const [first, second, third] = f.teamIds;
    if (!first || !second || !third) throw new Error("Missing teams");
    const rejected = await f.run(
      Effect.flatMap(Subscriptions, (subscriptions) =>
        subscriptions.replaceForUser({
          user,
          subjectIds: [first, second, third],
          schedule,
        }),
      ).pipe(Effect.flip),
    );
    expect(rejected).toMatchObject({
      _tag: "SubjectCapacityReached",
      limit: 2,
    });
    expect(
      (
        await f.database.query(
          "SELECT * FROM subscriptions WHERE user_id = $1",
          [newId],
        )
      ).rows,
    ).toHaveLength(6);
    await f.run(f.replace(newId, 2));
    expect(
      (
        await f.database.query(
          "SELECT * FROM subscriptions WHERE user_id = $1",
          [newId],
        )
      ).rows,
    ).toHaveLength(2);
  });

  it("caps notifications after Pro ends and continues all six for grandfathered users", async () => {
    const f = await makeFixture();
    await f.setPaid();
    await f.run(f.replace(newId, 6));
    await f.run(f.replace(existingId, 6));
    await f.database.exec(
      "UPDATE billing_subscriptions SET status = 'past_due'",
    );
    const recipients = await f.run(
      Effect.flatMap(Subscriptions, (subscriptions) =>
        subscriptions.listNotificationRecipients(),
      ),
    );
    expect(
      recipients.filter((recipient) => recipient.user.id === newId),
    ).toHaveLength(2);
    expect(
      recipients.filter((recipient) => recipient.user.id === existingId),
    ).toHaveLength(6);
    await f.database.query(
      "UPDATE users SET email_verified = false WHERE id = $1",
      [newId],
    );
    const verified = await f.run(
      Effect.flatMap(Subscriptions, (subscriptions) =>
        subscriptions.listNotificationRecipients(),
      ),
    );
    expect(
      verified.every((recipient) => recipient.user.id === existingId),
    ).toBe(true);
  });

  it("keeps billing accounts and grandfathering when unsubscribing from game-day emails", async () => {
    const f = await makeFixture();
    await f.setPaid();
    await f.run(f.replace(newId, 6));
    await f.run(f.replace(existingId, 6));
    await f.run(
      Effect.gen(function* () {
        const users = yield* Users;
        yield* users.remove(newId);
        yield* users.remove(existingId);
      }),
    );
    expect((await f.database.query("SELECT * FROM users")).rows).toHaveLength(
      2,
    );
    expect(
      (await f.database.query("SELECT * FROM subscriptions")).rows,
    ).toHaveLength(0);
    expect(
      (await f.database.query("SELECT * FROM billing_subscriptions")).rows,
    ).toHaveLength(1);
  });

  it("preserves retained teams' delivery history on roster edits", async () => {
    const f = await makeFixture();
    await f.run(f.replace(newId, 2));
    await f.database.exec(
      "UPDATE subscriptions SET last_sent_at = '2026-09-30T13:00:00.000Z'",
    );
    const before = (
      await f.database.query(
        "SELECT id, last_sent_at FROM subscriptions WHERE subject_id = $1",
        [f.teamIds[0]],
      )
    ).rows;
    await f.run(f.replace(newId, 1));
    expect(
      (await f.database.query("SELECT id, last_sent_at FROM subscriptions"))
        .rows,
    ).toEqual(before);
  });
});
