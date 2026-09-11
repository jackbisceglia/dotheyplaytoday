import { createEffect } from "solid-js";
import type { ParentProps } from "solid-js";

import { getSessionStatus, useSession } from "../auth.js";
import { authHint } from "./hint.js";

export function AuthHintSync(props: ParentProps) {
  const session = useSession();

  createEffect(
    () => getSessionStatus(session()),
    (status) => {
      if (status === "authenticated") authHint.set();
      if (status === "unauthenticated") authHint.clear();
    },
  );

  return props.children;
}
