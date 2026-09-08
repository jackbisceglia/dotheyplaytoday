import { useLocation } from "@solidjs/router";
import { createMemo, Errored, Loading, Show } from "solid-js";

import { getUser } from "../lib/session.js";
import { Landing } from "../modules/landing/Landing.jsx";
import { getSubjects } from "../modules/landing/queries.js";
import { Redirect } from "../modules/ui/Redirect.jsx";
import { Router } from "../router.js";

export default function LandingRoute() {
  const subjects = createMemo(() => getSubjects());
  const user = createMemo(() => getUser());
  const location = useLocation();

  return (
    <>
      <Errored fallback={null}>
        <Loading fallback={null}>
          <Show when={user()}>
            <Redirect
              href={`${Router.paths.home()}${location.search}${location.hash}`}
            />
          </Show>
        </Loading>
      </Errored>
      <Landing subjects={subjects()} />
    </>
  );
}
