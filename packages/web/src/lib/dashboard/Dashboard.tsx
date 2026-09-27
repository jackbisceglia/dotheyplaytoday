import { revalidate } from "@solidjs/router";
import { createMemo, Errored, Loading } from "solid-js";

import { getSubjects } from "../subjects.js";
import { DashboardHeading, Form } from "./Form.jsx";
import { getPreferences } from "./preferences.js";

export function Dashboard() {
  // Reading both for as long as the page is mounted keeps their router cache
  // entries alive, so opening the editor reuses the catalog the route
  // preloaded instead of fetching it again.
  const preferences = createMemo(() => getPreferences(), {
    ssrSource: "client",
  });
  const subjects = createMemo(() => getSubjects());

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
        <Loading
          fallback={
            <>
              <DashboardHeading />
              <p class="visually-hidden" role="status">
                Loading your picks…
              </p>
            </>
          }
        >
          <Form
            preferences={preferences()}
            subjects={subjects()}
            onSaved={() => {
              revalidate(getPreferences.key);
            }}
          />
        </Loading>
      </Errored>
    </section>
  );
}
