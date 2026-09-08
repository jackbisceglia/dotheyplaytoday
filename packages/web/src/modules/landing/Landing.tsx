import type { Subject } from "@dtpt/core/modules/subjects/schema";

import { Layout } from "../../layouts/Layout.jsx";
import { usePageMetadata } from "../../lib/metadata.js";
import { Router } from "../../router.js";
import { MagicLinkError } from "../auth/MagicLinkError.jsx";
import { Form as SignupForm } from "../signup/Form.jsx";
import { Ticker as ScoreTicker } from "../ui/Ticker.jsx";

const description =
  "Game-day emails for your teams. Pick your team, pick a time, and get an update on game day.";

export function Landing(props: { readonly subjects: readonly Subject[] }) {
  usePageMetadata("dotheyplaytoday", description);

  return (
    <Layout headerAction={{ href: "#signup", label: "Sign up" }}>
      <MagicLinkError banner />
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
          <a class="btn btn-secondary" href={Router.paths["sign-in"]()}>
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
