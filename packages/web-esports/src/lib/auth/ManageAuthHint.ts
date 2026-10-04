import { createEffect } from "solid-js";

import { getSessionStatus, useSession } from "../auth.js";
import { hint } from "./hint.js";

export function ManageAuthHint() {
  const session = useSession();

  createEffect(
    () => getSessionStatus(session()),
    (status) => {
      if (status === "authenticated") hint.set();
      if (status === "unauthenticated") hint.clear();
    },
  );

  return null;
}
