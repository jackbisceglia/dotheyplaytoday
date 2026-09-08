import { createContext, Errored, Loading, Show, useContext } from "solid-js";
import type { ParentProps } from "solid-js";

import type { auth } from "../lib/auth.js";
import { SessionContext } from "../lib/session.js";
import { Redirect } from "../modules/ui/Redirect.jsx";

export const UserContext =
  createContext<() => typeof auth.$Infer.Session.user>();

export function AuthenticatedLayout(props: ParentProps) {
  const user = useContext(SessionContext);

  return (
    <Errored
      fallback={
        <p class="form-error" role="alert">
          We couldn’t check your session. Refresh to try again.
        </p>
      }
    >
      <Loading fallback={<p>Checking your session...</p>}>
        <Show
          when={user()}
          fallback={
            <Show
              when={user() === null}
              fallback={<p>Checking your session...</p>}
            >
              <Redirect href="/" />
            </Show>
          }
        >
          {(user) => <UserContext value={user}>{props.children}</UserContext>}
        </Show>
      </Loading>
    </Errored>
  );
}
