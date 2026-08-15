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

  return (
    <Layout
      homeHref={props.homeHref}
      headerAction={{ href: "#signup", label: "Sign up" }}
    >
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
        <SignupForm subjects={props.subjects} />
      </section>
    </Layout>
  );
}
