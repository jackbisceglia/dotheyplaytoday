import { revalidate } from "@solidjs/router";
import { Result } from "effect";
import { createMemo, Errored } from "solid-js";

import { DashboardHeading, Form } from "./Form.jsx";
import { getEvents } from "./events.js";
import { getSubjects } from "../subjects.js";
import { scheduleRows, todayTeams } from "./schedule.js";
import { getPreferences } from "./preferences.js";

export function Dashboard() {
  const preferences = createMemo(() => getPreferences());
  const schedule = createMemo(() => getEvents());
  const subjects = createMemo(() => getSubjects());
  const teams = () => preferences().subscriptions.map((pick) => pick.subject);

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
              <p class="form-error">We couldn't load your dashboard.</p>
              <button
                class="btn btn-secondary"
                type="button"
                onClick={() => {
                  revalidate([
                    getPreferences.key,
                    getEvents.key,
                    getSubjects.key,
                  ]);
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
          subjects={subjects()}
          scheduleRows={scheduleRows(
            schedule(),
            teams(),
            Result.getOrElse(subjects(), () => []),
          )}
          todayTeams={todayTeams(schedule(), teams())}
          onSaved={() => {
            revalidate([getPreferences.key, getEvents.key]);
          }}
        />
      </Errored>
    </section>
  );
}
