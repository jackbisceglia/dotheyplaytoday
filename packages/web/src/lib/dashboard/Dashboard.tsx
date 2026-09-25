import { createMemo, Errored, Loading, refresh } from "solid-js";

import { DashboardHeading, Form } from "./Form.jsx";
import { getPreferences } from "./preferences.js";

export function Dashboard() {
  const preferences = createMemo(getPreferences, { ssrSource: "client" });

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
                  refresh(preferences);
                  reset();
                }}
              >
                Try again
              </button>
            </div>
          </>
        )}
      >
        <Loading
          fallback={
            <>
              <DashboardHeading />
              <p class="dashboard-status" role="status">
                Loading your picks…
              </p>
            </>
          }
        >
          <Form
            preferences={preferences()}
            onSaved={() => {
              refresh(preferences);
            }}
          />
        </Loading>
      </Errored>
    </section>
  );
}
