import { revalidate } from "@solidjs/router";
import { createMemo, Errored } from "solid-js";

import { DashboardHeading, Form } from "./Form.jsx";
import { getPreferences } from "./preferences.js";

export function Dashboard() {
  const preferences = createMemo(() => getPreferences());

  // No `Loading` here on purpose: a pending read holds the transition, so the
  // authenticated shell keeps its splash (or blank) until the whole page can
  // show with its data, instead of revealing the chrome first.
  return (
    <section class="dashboard" aria-labelledby="dashboard-title">
      <Errored
        fallback={(_error, reset) => (
          <>
            <DashboardHeading />
            <div class="dashboard-load-error" role="alert">
              <p class="form-error">We couldn't load your picks.</p>
              <button
                class="btn btn-secondary"
                type="button"
                onClick={() => {
                  revalidate(getPreferences.key);
                  reset();
                }}
              >
                Try again
              </button>
            </div>
          </>
        )}
      >
        <Form
          preferences={preferences()}
          onSaved={() => {
            revalidate(getPreferences.key);
          }}
        />
      </Errored>
    </section>
  );
}
