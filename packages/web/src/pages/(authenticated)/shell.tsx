import { useNavigate } from "@solidjs/router";
import { httpStatus } from "@solidjs/web";
import { createEffect, Errored, Match, Switch } from "solid-js";
import type { ParentProps } from "solid-js";

import { useSession } from "../../lib/auth.js";
import { useApplicationPath } from "../../lib/paths.js";
import { Splash } from "../../modules/ui/Splash.jsx";

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

function SessionGate(props: ParentProps) {
  const session = useSession();
  const navigate = useNavigate();
  const homeHref = useApplicationPath("home");

  createEffect(
    () =>
      !session().isPending && !session().error && !session().data
        ? homeHref()
        : undefined,
    (href) => {
      if (href !== undefined) navigate(href, { replace: true });
    },
  );

  if (!session().isPending && session().error) {
    httpStatus(500, "Failed to check the session");
    throw new Error("Failed to check the session");
  }

  return (
    <Switch fallback={<Splash />}>
      <Match when={session().data}>{props.children}</Match>
    </Switch>
  );
}

// Session gate for the authenticated section. While the session is unknown
// the section shows the splash — never public content, never a redirect
// guess. Redirects only fire after the client session settles, so SSR (which
// cannot see the API-host-only cookie) always renders the splash.
export function AuthenticatedShell(props: ParentProps) {
  return (
    <Errored fallback={(_error, reset) => <SessionError onRetry={reset} />}>
      <SessionGate>{props.children}</SessionGate>
    </Errored>
  );
}
