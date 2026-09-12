import { useNavigate } from "@solidjs/router";
import { createEffect, Errored, Match, Switch } from "solid-js";
import type { ParentProps } from "solid-js";

import { getSessionStatus, useSession } from "../../lib/auth.js";
import { useApplicationPath } from "../../lib/paths.js";
import { Splash } from "../../lib/ui/Splash.jsx";

function SessionError(props: { readonly onRetry: () => void }) {
  const session = useSession();

  return (
    <main class="splash" role="alert">
      <p class="form-error">
        We couldn't check your session.{" "}
        <button
          class="btn btn-secondary"
          type="button"
          onClick={() => {
            void session().refetch();
            props.onRetry();
          }}
        >
          Try again
        </button>
      </p>
    </main>
  );
}

function Authenticated(props: ParentProps) {
  const session = useSession();
  const navigate = useNavigate();
  const landingHref = useApplicationPath("landing");

  createEffect(
    () => getSessionStatus(session()),
    (state) => {
      if (state === "unavailable") {
        throw new Error("Failed to check the session");
      }

      if (state === "unauthenticated") {
        navigate(landingHref(), { replace: true });
      }
    },
  );

  return (
    <Switch fallback={<Splash />}>
      <Match when={session().data}>{props.children}</Match>
    </Switch>
  );
}

// Unknown session shows the splash; redirects wait for the client session.
export function AuthenticatedShell(props: ParentProps) {
  return (
    <Errored fallback={(_error, reset) => <SessionError onRetry={reset} />}>
      <Authenticated>{props.children}</Authenticated>
    </Errored>
  );
}
