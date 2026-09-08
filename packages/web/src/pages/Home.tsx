import { useNavigate } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import { authenticatedDestination, getAuthClient } from "../lib/auth.js";
import type { Subject } from "@dtpt/core/modules/subjects/schema";

import { Layout } from "../layouts/Layout.jsx";
import { usePageMetadata } from "../lib/metadata.js";
import { Form as SignupForm } from "../modules/signup/Form.jsx";
import { Ticker as ScoreTicker } from "../modules/ui/Ticker.jsx";

const description =
  "Game-day emails for your teams. Pick your team, pick a time, and get an update on game day.";

export function Home(props: {
  readonly homeHref: string;
  readonly subjects: readonly Subject[];
}) {
  usePageMetadata("dotheyplaytoday", description);

  const navigate = useNavigate();
  const [linkFailed, setLinkFailed] = createSignal(false);
  createEffect(
    () => undefined,
    () => {
      let active = true;
      setLinkFailed(new URLSearchParams(window.location.search).has("error"));
      void getAuthClient()
        .then((client) => client.getSession())
        .then((result) => {
          if (active && result.data) {
            navigate(authenticatedDestination(window.location.search), {
              replace: true,
            });
          }
        })
        .catch((error: unknown) => {
          console.error("Failed to check the session", error);
        });
      return () => {
        active = false;
      };
    },
  );

  return (
    <Layout
      homeHref={props.homeHref}
      headerAction={{ href: "#signup", label: "Sign up" }}
    >
      <Show when={linkFailed()}>
        <p class="form-error form-error-banner" role="alert">
          This link is invalid or has expired.{" "}
          <a href="/sign-in">Request a new link</a>.
        </p>
      </Show>
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
          <a class="btn btn-secondary" href="/sign-in">
            Sign in
          </a>
        </div>
      </section>

      <ScoreTicker />

      <section class="signup" id="signup">
        <div class="signup-header">
          <h2 class="signup-title">Get on the roster</h2>
        </div>
        <SignupForm subjects={props.subjects} />
      </section>
    </Layout>
  );
}
