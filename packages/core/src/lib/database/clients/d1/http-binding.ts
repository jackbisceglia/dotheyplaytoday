import type { DatabaseBinding } from "./layer.js";

/**
 * TODO(alchemy): delete this file once Alchemy supports D1 bindings inside
 * Actions (per maintainers, planned). It emulates the native `D1Database`
 * binding over the Cloudflare REST API so deploy-time code (Actions) can
 * reuse `createD1DatabaseLayer` unchanged. Only the surface exercised by
 * `@effect/sql-d1` is implemented: `prepare` / `bind` / `all` / `raw`.
 *
 * The REST API has no transactions; `batch` runs statements sequentially
 * without atomicity, matching the already-accepted D1 transaction gap.
 */

const DEFAULT_API_BASE_URL = "https://api.cloudflare.com/client/v4";

export type D1HttpBindingConfig = {
  accountId: string;
  databaseId: string;
  /** Auth headers for the Cloudflare REST API, e.g. `Authorization: Bearer <token>`. */
  headers: Record<string, string>;
  apiBaseUrl?: string;
};

type D1HttpStatementResult<Results> = {
  results: Results;
  success: boolean;
  meta: Record<string, unknown>;
};

async function postSql<Results>(
  config: D1HttpBindingConfig,
  endpoint: "query" | "raw",
  sql: string,
  params: readonly unknown[],
): Promise<D1HttpStatementResult<Results>> {
  const base = config.apiBaseUrl ?? DEFAULT_API_BASE_URL;
  const url = `${base}/accounts/${config.accountId}/d1/database/${config.databaseId}/${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...config.headers },
    body: JSON.stringify({ sql, params }),
  });

  const text = await response.text();
  let body:
    | {
        success: boolean;
        errors?: { code: number; message: string }[];
        result?: D1HttpStatementResult<Results>[];
      }
    | undefined;
  try {
    body = JSON.parse(text) as typeof body;
  } catch {
    // fall through to the status-based error below
  }

  if (!response.ok || !body?.success) {
    const details =
      body?.errors
        ?.map((error) => `${error.code.toString()}: ${error.message}`)
        .join("; ") ?? text.slice(0, 200);
    throw new Error(
      `D1 HTTP ${endpoint} failed (status ${response.status.toString()}): ${details}`,
    );
  }

  const result = body.result?.[0];
  if (!result?.success) {
    throw new Error(
      `D1 HTTP ${endpoint} returned no successful statement result`,
    );
  }

  return result;
}

class D1HttpPreparedStatement {
  constructor(
    private readonly config: D1HttpBindingConfig,
    private readonly sql: string,
    private readonly params: readonly unknown[] = [],
  ) {}

  bind(...values: unknown[]) {
    return new D1HttpPreparedStatement(this.config, this.sql, values);
  }

  async all() {
    return postSql<Record<string, unknown>[]>(
      this.config,
      "query",
      this.sql,
      this.params,
    );
  }

  async raw(options?: { columnNames?: boolean }) {
    const result = await postSql<{ columns: string[]; rows: unknown[][] }>(
      this.config,
      "raw",
      this.sql,
      this.params,
    );
    const { columns, rows } = result.results;
    return options?.columnNames ? [columns, ...rows] : rows;
  }

  async first(column?: string) {
    const { results } = await this.all();
    const row = results[0];
    if (row === undefined) return null;
    return column === undefined ? row : (row[column] ?? null);
  }

  async run() {
    return this.all();
  }
}

export function createD1HttpBinding(
  config: D1HttpBindingConfig,
): DatabaseBinding {
  const binding = {
    prepare: (sql: string) => new D1HttpPreparedStatement(config, sql),
    exec: async (sql: string) => {
      const result = await postSql(config, "query", sql, []);
      return { count: 1, duration: Number(result.meta.duration ?? 0) };
    },
    batch: async (statements: D1HttpPreparedStatement[]) => {
      const results = [];
      for (const statement of statements) {
        results.push(await statement.all());
      }
      return results;
    },
    withSession: () => {
      throw new Error("withSession is not supported over the D1 HTTP API");
    },
    dump: () => {
      throw new Error("dump is not supported over the D1 HTTP API");
    },
  };

  return binding as unknown as DatabaseBinding;
}
