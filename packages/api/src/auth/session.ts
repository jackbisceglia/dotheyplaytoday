import type { Auth } from "./auth.js";

/** Reusable server boundary for future authenticated API handlers. */
export const getRequestSession = (auth: Auth, headers: Headers) =>
  auth.api.getSession({ headers });

export type RequestSession = NonNullable<
  Awaited<ReturnType<typeof getRequestSession>>
>;
