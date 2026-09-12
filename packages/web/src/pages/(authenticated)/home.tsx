import { useNavigate, useSearchParams } from "@solidjs/router";
import { createSignal, Show } from "solid-js";

import { auth } from "../../lib/auth.js";
import { Layout } from "../../layouts/Layout.jsx";
import { usePageMetadata } from "../../lib/metadata.js";
import { useApplicationPath } from "../../lib/paths.js";

export function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const [signOutError, setSignOutError] = createSignal<string>();
  const unsubscribePath = useApplicationPath("unsubscribe");
  usePageMetadata("Home | dotheyplaytoday", "Your game-day subscriptions.");

  const signOut = async () => {
    setSignOutError(undefined);

    try {
      const result = await auth.signOut();

      if (result.error) {
        setSignOutError("We couldn't sign you out. Try again.");
        return;
      }

      navigate("/", { replace: true });
    } catch {
      setSignOutError("We couldn't sign you out. Try again.");
    }
  };

  return (
    <Layout
      headerActions={[{ label: "Sign out", onClick: () => void signOut() }]}
      unsubscribeHref={unsubscribePath()}
    >
      <Show when={signOutError()}>
        {(message) => (
          <div class="app-toast" role="alert">
            {message()}
          </div>
        )}
      </Show>
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
        <h1 class="dashboard-title">
          Your dashboard
          <br />
          <em>is on the way.</em>
        </h1>
        <p class="dashboard-copy">
          Soon you'll manage your teams and game-day emails right here.
        </p>
      </section>
    </Layout>
  );
}
