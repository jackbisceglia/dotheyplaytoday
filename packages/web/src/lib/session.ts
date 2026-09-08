import { query } from "@solidjs/router";
import { createContext } from "solid-js";

import { auth } from "./auth.js";

const queryUser = query(async () => {
  const { data, error } = await auth.getSession();
  if (error) throw new Error(error.message, { cause: error });

  return data?.user ?? null;
}, "user");

export function getUser() {
  // Web SSR cannot read the API's host-only cookie. Keep that placeholder out of the cache.
  return import.meta.env.SSR ? undefined : queryUser();
}

export const UserContext =
  createContext<() => typeof auth.$Infer.Session.user>();
