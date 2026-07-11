import {
  Credentials,
  formatHeaders,
} from "@distilled.cloud/cloudflare/Credentials";
import { Effect, Layer } from "effect";

import { createD1DatabaseLayer, type DatabaseBinding } from "./layer.js";

/**
 * TODO(alchemy): delete this file once Alchemy supports D1 bindings inside
 * Actions. It emulates the native `D1Database` binding over the Cloudflare
 * REST API so deploy-time code can reuse `createD1DatabaseLayer` unchanged.
 * Only the surface `@effect/sql-d1` exercises is emulated:
 * `prepare` / `bind` / `all` / `raw`.
 *
 * Requests go through plain fetch rather than Alchemy's D1 REST client:
 * its request schema rejects non-string params, but the API accepts and
 * round-trips typed JSON values (numbers, null), which prepared statements
 * rely on. Credentials still come from the Alchemy stack context.
 *
 * Kept out of `layer.ts` so Worker bundles never pull in the REST client.
 */
export type D1HttpDatabaseConfig = {
  accountId: string;
  databaseId: string;
};

type D1HttpEnvelope<Results> = {
  success: boolean;
  errors: { code: number; message: string }[];
  result: { results?: Results | null }[];
};

/**
 * Creates a Cloudflare D1-backed database layer that talks to the D1 REST
 * API instead of a Worker binding. Requires `Credentials` from the Alchemy
 * stack context.
 */
export function createD1HttpDatabaseLayer(config: D1HttpDatabaseConfig) {
  const BindingEffect = Effect.gen(function* () {
    const resolveCredentials = yield* Credentials;

    const post = <Results>(
      endpoint: "query" | "raw",
      sql: string,
      params: readonly unknown[],
    ) =>
      Effect.flatMap(resolveCredentials, (credentials) =>
        Effect.promise(async () => {
          const url = `${credentials.apiBaseUrl}/accounts/${config.accountId}/d1/database/${config.databaseId}/${endpoint}`;
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...formatHeaders(credentials),
            },
            body: JSON.stringify({ sql, params }),
            signal: AbortSignal.timeout(30_000),
          });

          const envelope = (await response.json()) as D1HttpEnvelope<Results>;
          if (!envelope.success) {
            const details = envelope.errors
              .map((error) => `${error.code.toString()}: ${error.message}`)
              .join("; ");
            throw new Error(
              `D1 ${endpoint} failed (${response.status.toString()}): ${details}`,
            );
          }

          return envelope.result[0]?.results;
        }),
      );

    const statement = (sql: string, params: readonly unknown[] = []) => ({
      bind: (...values: unknown[]) => statement(sql, values),
      all: () =>
        Effect.runPromise(
          Effect.map(
            post<Record<string, unknown>[]>("query", sql, params),
            (results) => ({ results: results ?? [] }),
          ),
        ),
      raw: () =>
        Effect.runPromise(
          Effect.map(
            post<{ rows?: unknown[][] | null }>("raw", sql, params),
            (results) => results?.rows ?? [],
          ),
        ),
    });

    const binding = { prepare: (sql: string) => statement(sql) };
    return createD1DatabaseLayer(binding as unknown as DatabaseBinding);
  });

  return Layer.unwrap(BindingEffect);
}
