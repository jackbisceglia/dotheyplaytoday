import { Effect } from "effect";

import { Auth } from "./auth.js";

export const getSession = Effect.fn("Auth.getSession")(function* (
  auth: Auth["Service"],
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
  const auth = yield* Auth;

  return yield* getSession(auth, headers);
});

export type RequestSession = NonNullable<
  Effect.Success<ReturnType<typeof getRequestSession>>
>;
