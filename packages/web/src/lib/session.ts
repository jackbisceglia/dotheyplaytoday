import { query } from "@solidjs/router";
import { createContext } from "solid-js";

import { auth } from "./auth.js";

export const getUser = query(async () => {
  const { data, error } = await auth.getSession();
  if (error) throw new Error(error.message, { cause: error });

  return data?.user ?? null;
}, "user");

export const SessionContext =
  createContext<() => typeof auth.$Infer.Session.user | null | undefined>();
