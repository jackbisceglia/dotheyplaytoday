import { useNavigate } from "@solidjs/router";
import { Result } from "effect";
import { createEffect, createMemo } from "solid-js";

import { useSession } from "../lib/auth.js";
import { clearAuthHint, setAuthHint } from "../lib/auth/hint.js";
import { Layout } from "../layouts/Layout.jsx";
import { usePageMetadata } from "../lib/metadata.js";
import { useApplicationPath } from "../lib/paths.js";
import { getSubjects } from "../lib/subjects.js";
import { Form as SignupForm } from "../modules/signup/Form.jsx";
import { Ticker as ScoreTicker } from "../modules/ui/Ticker.jsx";

const description =
  "Game-day emails for your teams. Pick your team, pick a time, and get an update on game day.";

export function preload() {
  return getSubjects();
}

export function Landing() {
  usePageMetadata("dotheyplaytoday", description);
  const result = createMemo(() => getSubjects());
  const session = useSession();
  const navigate = useNavigate();
  const homeHref = useApplicationPath("home");

  // Signed-in visitors upgrade to /home after the session settles.
  createEffect(
    () => {
      const current = session();

      if (current.isPending || current.error) return "pending";
      return current.data ? "authenticated" : "unauthenticated";
    },
    (state) => {
      if (state === "authenticated") {
        setAuthHint();
        navigate(homeHref(), { replace: true });
      } else if (state === "unauthenticated") {
        clearAuthHint();
      }
    },
  );

  return (
    <Layout headerAction={{ href: "#signup", label: "Sign up" }}>
      <section class="hero">
        <h1 class="hero-headline">
          Your team plays
          <br />
          <em>tonight.</em>
          <br />
          Now you know.
        </h1>
        <p class="hero-copy">
          Pick your team, pick a time, and get an update on game day.
        </p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#signup">
            Get game-day updates
          </a>
        </div>
      </section>

      <ScoreTicker />

      <section class="signup" id="signup">
        <div class="signup-header">
          <h2 class="signup-title">Get on the roster</h2>
        </div>
        {Result.match(result(), {
          onSuccess: (subjects) => <SignupForm subjects={subjects} />,
          onFailure: () => (
            <p class="form-error" role="alert">
              We couldn't load the team list. Try reloading the page.
            </p>
          ),
        })}
      </section>
    </Layout>
  );
}
