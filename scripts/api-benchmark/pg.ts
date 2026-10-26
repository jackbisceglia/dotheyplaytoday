// Deterministic persistence substitute. No socket or external database is used.
export const counters = { pools: 0, closes: 0, queries: 0 };
const userId = "00000000-0000-4000-8000-000000000001";
const now = new Date("2098-01-01T00:00:00Z");
export class Pool {
  constructor() {
    counters.pools++;
  }
  on() {
    return this;
  }
  async end() {
    counters.closes++;
  }
  async connect(callback) {
    const client = {
      query: this.query.bind(this),
      release() {},
      on() {},
      removeListener() {},
    };
    if (callback) callback(null, client, client.release);
    return client;
  }
  query(config, values, callback) {
    counters.queries++;
    const sql = typeof config === "string" ? config : config.text;
    let rows = [];
    if (sql.includes('from "auth_sessions"')) {
      rows = [
        [
          "session-id",
          new Date("2099-01-01"),
          "benchmark-token",
          now,
          now,
          null,
          null,
          userId,
        ],
      ];
    } else if (sql.includes('from "users"')) {
      rows =
        sql.includes('"email_verified"') && !sql.includes('"timezone"')
          ? [[userId, null, "user@example.com", true, now, now]]
          : [
              [
                userId,
                "user@example.com",
                "UTC",
                "00000000-0000-4000-8000-000000000002",
                null,
                true,
                now,
                now,
              ],
            ];
    } else if (
      !sql.includes("subscriptions") &&
      !/^(begin|commit|rollback)/i.test(sql)
    ) {
      throw new Error(`Unhandled benchmark SQL: ${sql}`);
    }
    if (sql.includes("::text"))
      rows = rows.map((row) =>
        row.map((value) =>
          value instanceof Date ? value.toISOString() : value,
        ),
      );
    if (globalThis.BENCH_LOG_SQL) console.log(sql, JSON.stringify(rows));
    const result = { rows, rowCount: rows.length, fields: [] };
    const cb = typeof values === "function" ? values : callback;
    if (cb) {
      queueMicrotask(() => cb(null, result));
      return;
    }
    return Promise.resolve(result);
  }
}
export const types = {
  getTypeParser: () => (value) => value,
  setTypeParser() {},
};
export default { Pool, types };
