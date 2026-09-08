import type { ParentProps } from "solid-js";
import { createMemo, Errored, Loading, Match, Switch } from "solid-js";

import { getUser, UserContext } from "../../lib/session.js";
import { Router } from "../../router.js";
import { Redirect } from "../ui/Redirect.jsx";

function CheckingSession() {
  return <p>Checking your session...</p>;
}

export default function RequireAuth(props: ParentProps) {
  const user = createMemo(() => getUser());

  return (
    <Errored
      fallback={
        <p class="form-error" role="alert">
          We couldn’t check your session. Refresh to try again.
        </p>
      }
    >
      <Loading fallback={<CheckingSession />}>
        <Switch>
          <Match when={user() === undefined}>
            <CheckingSession />
          </Match>
          <Match when={user() === null}>
            <Redirect href={Router.paths()} />
          </Match>
          <Match when={user()}>
            {(user) => <UserContext value={user}>{props.children}</UserContext>}
          </Match>
        </Switch>
      </Loading>
    </Errored>
  );
}
