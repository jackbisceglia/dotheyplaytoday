import { useLocation, useSearchParams } from "@solidjs/router";
import { createEffect, Show, untrack, useContext } from "solid-js";

import { Layout } from "../layouts/Layout.jsx";
import { UserContext } from "../layouts/AuthenticatedLayout.jsx";
import { usePageMetadata } from "../lib/metadata.js";

export function AuthenticatedHome() {
  const user = useContext(UserContext);
  usePageMetadata("Home | dotheyplaytoday", "Your game-day updates.");
  const location = useLocation();
  const [search, setSearch] = useSearchParams();
  const confirmed = untrack(
    () =>
      search.confirmed === "1" &&
      user().emailVerified &&
      search.error === undefined,
  );

  createEffect(
    () => ({ confirmed: search.confirmed, state: location.state }),
    ({ confirmed, state }) => {
      if (confirmed !== undefined) {
        setSearch({ confirmed: undefined }, { replace: true, state });
      }
    },
  );

  return (
    <Layout
      homeHref="/home"
      headerAction={{ href: "/feedback", label: "Feedback" }}
    >
      <section class="signup">
        <Show when={search.error !== undefined}>
          <p class="form-error" role="alert">
            This link is invalid or has expired.{" "}
            <a href="/sign-in">Request a new link</a>.
          </p>
        </Show>
        <Show when={confirmed}>
          <p class="confirmation-banner" role="status">
            Welcome to dotheyplaytoday! Your email is confirmed.
          </p>
        </Show>
        <h1 class="signup-title">Your game-day updates</h1>
        <p>Signed in as {user().email}.</p>
        <p>
          {user().emailVerified
            ? "Your saved teams and schedule are ready for game day."
            : "Confirm your email to start your updates."}
        </p>
      </section>
    </Layout>
  );
}
