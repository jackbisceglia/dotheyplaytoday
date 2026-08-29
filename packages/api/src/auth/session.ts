import { Effect } from "effect";

import { Auth } from "./auth.js";

export const getSession = Effect.fn("Auth.getSession")(function* (
  auth: Auth,
  headers: Headers,
) {
  return yield* Effect.tryPromise(() => auth.api.getSession({ headers })).pipe(
    Effect.orDie,
  );
});

/** Reusable server boundary for authenticated API handlers. */
export const getRequestSession = Effect.fn("Auth.getRequestSession")(function* (
  headers: Headers,
) {
  const makeAuth = yield* Auth;
  const context = yield* Effect.context();

  return yield* getSession(makeAuth(context), headers);
});

export type RequestSession = NonNullable<
  Effect.Success<ReturnType<typeof getRequestSession>>
>;
