import { Match, Switch } from "solid-js";
import type { ParentProps } from "solid-js";

import { useApplicationPath } from "../../lib/paths.js";
import { useSession } from "../../lib/auth.js";
import { Redirect } from "../../modules/ui/Redirect.jsx";
import { Splash } from "../../modules/ui/Splash.jsx";

// Session gate for the authenticated section. While the session is unknown
// the section shows the splash — never public content, never a redirect
// guess. Redirects only fire after the client session settles, so SSR (which
// cannot see the API-host-only cookie) always renders the splash.
export function AuthenticatedShell(props: ParentProps) {
  const session = useSession();
  const homeHref = useApplicationPath("home");

  return (
    <Switch fallback={<Splash />}>
      <Match when={!session().isPending && session().error}>
        <main class="splash" role="alert">
          <p class="form-error">
            We couldn't check your session.{" "}
            <button
              class="btn btn-secondary"
              type="button"
              onClick={() => void session().refetch()}
            >
              Try again
            </button>
          </p>
        </main>
      </Match>
      <Match when={!session().isPending && !session().data}>
        <Redirect href={homeHref()} />
      </Match>
      <Match when={session().data}>{props.children}</Match>
    </Switch>
  );
}
