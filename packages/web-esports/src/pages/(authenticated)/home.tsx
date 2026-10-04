import { useNavigate, useSearchParams } from "@solidjs/router";
import { createSignal, Show } from "solid-js";

import { Dashboard } from "../../lib/dashboard/Dashboard.jsx";
import { getEvents } from "../../lib/dashboard/events.js";
import { getPreferences } from "../../lib/dashboard/preferences.js";

import { auth } from "../../lib/auth.js";
import { Layout } from "../../layouts/Layout.jsx";
import { usePageMetadata } from "../../lib/metadata.js";
import { useApplicationPath } from "../../lib/paths.js";
import { getSubjects } from "../../lib/subjects.js";

export function preload() {
  // Private queries need the browser's API cookie, so only the client starts
  // them; they load alongside the session check instead of after it.
  if (!import.meta.env.SSR) {
    void getPreferences();
    void getEvents();
  }
  return getSubjects();
}

export function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const [signOutError, setSignOutError] = createSignal<string>();
  const unsubscribePath = useApplicationPath("unsubscribe");
  usePageMetadata("Home | dotheyplaytoday", "Your match-day subscriptions.");

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
      headerActions={[
        { label: "Sign out", variant: "link", onClick: () => void signOut() },
      ]}
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
          <span>Your email is confirmed. You're locked in.</span>
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
      <Dashboard />
    </Layout>
  );
}
