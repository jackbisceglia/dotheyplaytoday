import { useNavigate, useSearchParams } from "@solidjs/router";
import { Result } from "effect";
import { createSignal, Show } from "solid-js";

import { auth, useSession } from "../../lib/auth.js";
import { withApiResult } from "../../lib/api.js";
import { Layout } from "../../layouts/Layout.jsx";
import { usePageMetadata } from "../../lib/metadata.js";
import { useApplicationPath } from "../../lib/paths.js";

export function Home() {
  const session = useSession();
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const unsubscribePath = useApplicationPath("unsubscribe");
  const [unsubscribeHref, setUnsubscribeHref] = createSignal(
    unsubscribePath().replace(":token", "unavailable"),
  );
  usePageMetadata("Home | dotheyplaytoday", "Your game-day subscriptions.");

  if (!import.meta.env.SSR) {
    void withApiResult((client) => client.user.get()).then(
      Result.match({
        onSuccess: (user) =>
          setUnsubscribeHref(
            unsubscribePath().replace(":token", user.unsubscribeToken),
          ),
        onFailure: () => undefined,
      }),
    );
  }

  const signOut = () => {
    void auth.signOut().finally(() => {
      navigate("/", { replace: true });
    });
  };

  return (
    <Layout
      headerActions={[{ label: "Sign out", onClick: signOut }]}
      unsubscribeHref={unsubscribeHref()}
    >
      <Show when={search.confirmation === "1"}>
        <aside class="confirmation-alert" role="alert">
          <span>Your email is confirmed. You're on the roster.</span>
          <button
            type="button"
            aria-label="Dismiss confirmation"
            onClick={() => {
              setSearch({ confirmation: undefined }, { replace: true });
            }}
          >
            ×
          </button>
        </aside>
      </Show>
      <section class="dashboard">
        <p class="dashboard-eyebrow">
          Signed in as {session().data?.user.email ?? "you"}
        </p>
        <h1 class="dashboard-title">Dashboard coming soon.</h1>
        <p class="dashboard-copy">
          You'll be able to manage your teams and notification schedule here.
        </p>
      </section>
    </Layout>
  );
}
