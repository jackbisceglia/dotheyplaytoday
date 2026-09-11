import { createEffect } from "solid-js";

import { getSessionStatus, useSession } from "../auth.js";
import { authHint } from "./hint.js";

export function ManageAuthHint() {
  const session = useSession();

  createEffect(
    () => getSessionStatus(session()),
    (status) => {
      if (status === "authenticated") authHint.set();
      if (status === "unauthenticated") authHint.clear();
    },
  );

  return null;
}
