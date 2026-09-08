import { useLocation, useSearchParams } from "@solidjs/router";
import { createEffect, Show, untrack } from "solid-js";

import { Layout } from "../layouts/Layout.jsx";
import type { auth } from "../lib/auth.js";
import { usePageMetadata } from "../lib/metadata.js";

export function AuthenticatedHome(props: {
  readonly user: typeof auth.$Infer.Session.user;
}) {
  usePageMetadata("Home | dotheyplaytoday", "Your game-day updates.");
  const location = useLocation();
  const [search, setSearch] = useSearchParams();
  const confirmed = untrack(
    () =>
      search.confirmed === "1" &&
      props.user.emailVerified &&
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
        <p>Signed in as {props.user.email}.</p>
        <p>
          {props.user.emailVerified
            ? "Your saved teams and schedule are ready for game day."
            : "Confirm your email to start your updates."}
        </p>
      </section>
    </Layout>
  );
}
