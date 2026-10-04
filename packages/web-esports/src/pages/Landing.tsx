import { revalidate, useNavigate, useSearchParams } from "@solidjs/router";
import { Result } from "effect";
import { createEffect, createMemo, Loading, Show } from "solid-js";

import { getSessionStatus, useSession } from "../lib/auth.js";
import { Layout } from "../layouts/Layout.jsx";
import { usePageMetadata } from "../lib/metadata.js";
import { useApplicationPath } from "../lib/paths.js";
import { getSubjects } from "../lib/subjects.js";
import { Login } from "../lib/auth/Login.jsx";
import { Form as SignupForm } from "../lib/signup/Form.jsx";
import { MockSeries } from "../lib/ui/MockSeries.jsx";

const description =
  "Match-day emails for your esports teams. Pick your team, pick a time, and get an update on match day.";

export function preload() {
  return getSubjects();
}

export function Landing() {
  usePageMetadata("dotheyplaytoday", description);
  const result = createMemo(() => getSubjects());
  const session = useSession();
  const navigate = useNavigate();
  const homeHref = useApplicationPath("home");
  const loginHref = useApplicationPath("login");
  const [search] = useSearchParams();

  // Signed-in visitors upgrade to /home after the session settles.
  createEffect(
    () => getSessionStatus(session()),
    (state) => {
      if (state === "authenticated") {
        navigate(homeHref(), { replace: true });
      }
    },
  );

  // Render nothing once the session is known to be signed in, so the redirect
  // above never paints the landing page first.
  return (
    <Show when={getSessionStatus(session()) !== "authenticated"}>
      <Layout
        headerActions={[
          { href: loginHref(), label: "Log in", variant: "quiet" },
          { href: "#signup", label: "Sign up", variant: "solid" },
        ]}
      >
        <Show when={search.modal === "login"}>
          <Login />
        </Show>
        <section class="match-hero">
          <div class="match-hero-intro">
            <h1 class="match-hero-headline">
              Never forget when your team <em>loads in.</em>
            </h1>
            <p class="hero-copy">
              Pick your team, pick a time, and get an update on match day.
            </p>
            <div class="match-hero-actions">
              <a class="btn btn-primary" href="#signup">
                Lock in your teams
              </a>
            </div>
          </div>
          <MockSeries />
        </section>

        <section class="signup" id="signup">
          <div class="signup-header">
            <h2 class="signup-title">Queue up</h2>
          </div>
          <Loading fallback={<p role="status">Loading teams…</p>}>
            {Result.match(result(), {
              onSuccess: (subjects) => <SignupForm subjects={subjects} />,
              onFailure: () => (
                <p class="form-error" role="alert">
                  We couldn't load the team list.{" "}
                  <button
                    type="button"
                    class="btn btn-secondary"
                    onClick={() => {
                      revalidate(getSubjects.key);
                    }}
                  >
                    Try again
                  </button>
                </p>
              ),
            })}
          </Loading>
        </section>
      </Layout>
    </Show>
  );
}
