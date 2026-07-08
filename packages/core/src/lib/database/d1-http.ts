import type { D1Client } from "@effect/sql-d1";
import { Config, Effect, Layer, Option, Redacted, Schema } from "effect";

import { serialize } from "../utils.js";
import { createD1DatabaseLayer } from "./d1.js";

const CloudflareApiBaseUrl = "https://api.cloudflare.com/client/v4";

/**
 * Credentials and optional database override for reaching D1 through the
 * Cloudflare HTTP API from outside a Worker (e.g. the seed CLI). The
 * `D1_DATABASE_ID` override skips name-based resolution entirely.
 */
export const D1HttpConfig = Config.all({
  accountId: Config.string("CLOUDFLARE_ACCOUNT_ID"),
  apiToken: Config.redacted("CLOUDFLARE_API_TOKEN"),
  databaseId: Config.string("D1_DATABASE_ID").pipe(Config.option),
});

export class D1HttpDatabaseResolutionError extends Schema.TaggedErrorClass<D1HttpDatabaseResolutionError>()(
  "D1HttpDatabaseResolutionError",
  { message: Schema.String },
) {}

type D1HttpTarget = {
  readonly accountId: string;
  readonly apiToken: Redacted.Redacted;
  readonly databaseId: string;
};

type CloudflareApiEnvelope<Result> = {
  readonly success: boolean;
  readonly errors?: readonly {
    readonly code: number;
    readonly message: string;
  }[];
  readonly result: Result;
};

type D1QueryStatementResult = {
  readonly results: Record<string, unknown>[];
  readonly meta: Record<string, unknown>;
};

type D1RawStatementResult = {
  readonly results: {
    readonly columns: string[];
    readonly rows: unknown[][];
  };
  readonly meta: Record<string, unknown>;
};

const callCloudflareApi = async <Result>(input: {
  readonly path: string;
  readonly apiToken: Redacted.Redacted;
  readonly method: "GET" | "POST";
  readonly body?: unknown;
}) => {
  const response = await fetch(`${CloudflareApiBaseUrl}${input.path}`, {
    method: input.method,
    headers: {
      authorization: `Bearer ${Redacted.value(input.apiToken)}`,
      "content-type": "application/json",
    },
    ...(input.body !== undefined && { body: JSON.stringify(input.body) }),
  });

  const text = await response.text();

  let envelope: CloudflareApiEnvelope<Result>;
  try {
    envelope = JSON.parse(text) as CloudflareApiEnvelope<Result>;
  } catch {
    throw new Error(
      `Cloudflare API returned a non-JSON response (${response.status.toString()}): ${text}`,
    );
  }

  if (!response.ok || !envelope.success) {
    const messages = envelope.errors?.map((error) => error.message) ?? [text];

    throw new Error(
      `Cloudflare API request failed (${response.status.toString()}): ${messages.join("; ")}`,
    );
  }

  return envelope.result;
};

const postD1Statement = async <StatementResult>(
  target: D1HttpTarget,
  endpoint: "query" | "raw",
  sql: string,
  params: readonly unknown[],
) => {
  const result = await callCloudflareApi<StatementResult[]>({
    path: `/accounts/${target.accountId}/d1/database/${target.databaseId}/${endpoint}`,
    apiToken: target.apiToken,
    method: "POST",
    body: { sql, params },
  });

  const statementResult = result[0];

  if (statementResult === undefined) {
    throw new Error(
      `Cloudflare D1 ${endpoint} returned no statement results: ${serialize(result)}`,
    );
  }

  return statementResult;
};

/**
 * Minimal `D1Database`-shaped adapter over the Cloudflare D1 HTTP API.
 * `@effect/sql-d1` only calls `prepare(sql).bind(...params)` followed by
 * `.all()` or `.raw()`, so only that surface is implemented; the cast hides
 * the rest of the Workers binding interface.
 */
const createD1HttpBinding = (target: D1HttpTarget) => {
  const prepare = (sql: string) => {
    const makeStatement = (params: readonly unknown[]) => ({
      bind: (...values: readonly unknown[]) => makeStatement(values),
      all: async () => {
        const statement = await postD1Statement<D1QueryStatementResult>(
          target,
          "query",
          sql,
          params,
        );

        return {
          results: statement.results,
          success: true,
          meta: statement.meta,
        };
      },
      raw: async () => {
        const statement = await postD1Statement<D1RawStatementResult>(
          target,
          "raw",
          sql,
          params,
        );

        return statement.results.rows;
      },
    });

    return makeStatement([]);
  };

  return { prepare } as unknown as D1Client.D1ClientConfig["db"];
};

type D1DatabaseListing = {
  readonly uuid: string;
  readonly name: string;
};

const resolveDatabaseByNamePrefix = Effect.fn(
  "D1HttpDatabase.resolveDatabaseByNamePrefix",
)(function* (
  config: Config.Success<typeof D1HttpConfig>,
  databaseNamePrefix: string,
) {
  const databases = yield* Effect.tryPromise({
    try: () =>
      callCloudflareApi<D1DatabaseListing[]>({
        path: `/accounts/${config.accountId}/d1/database?name=${encodeURIComponent(databaseNamePrefix)}&per_page=100`,
        apiToken: config.apiToken,
        method: "GET",
      }),
    catch: (cause) =>
      new D1HttpDatabaseResolutionError({ message: serialize(cause) }),
  });

  const matches = databases.filter((database) =>
    database.name.startsWith(databaseNamePrefix),
  );

  if (matches.length === 1 && matches[0]) {
    return matches[0];
  }

  if (matches.length === 0) {
    return yield* new D1HttpDatabaseResolutionError({
      message: `No D1 database found with name prefix "${databaseNamePrefix}". Deploy the stack first (pnpm dev:infra or pnpm deploy).`,
    });
  }

  return yield* new D1HttpDatabaseResolutionError({
    message: `Multiple D1 databases match name prefix "${databaseNamePrefix}" (${matches
      .map((database) => database.name)
      .join(", ")}). Set D1_DATABASE_ID to disambiguate.`,
  });
});

/**
 * Creates a D1-backed database layer that talks to the Cloudflare HTTP API
 * instead of a Worker binding. The target database is resolved by its
 * Alchemy physical-name prefix unless `D1_DATABASE_ID` is set.
 */
export const createD1HttpDatabaseLayer = (options: {
  readonly databaseNamePrefix: string;
}) =>
  Layer.unwrap(
    Effect.gen(function* () {
      const config = yield* D1HttpConfig;

      const database = Option.isSome(config.databaseId)
        ? { uuid: config.databaseId.value, name: config.databaseId.value }
        : yield* resolveDatabaseByNamePrefix(
            config,
            options.databaseNamePrefix,
          );

      yield* Effect.logInfo("d1-http: resolved database", {
        name: database.name,
        uuid: database.uuid,
      });

      return createD1DatabaseLayer(
        createD1HttpBinding({
          accountId: config.accountId,
          apiToken: config.apiToken,
          databaseId: database.uuid,
        }),
      );
    }),
  );
