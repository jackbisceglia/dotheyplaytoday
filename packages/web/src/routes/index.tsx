import { createFileRoute } from "@tanstack/solid-router";

import { Layout } from "../layouts/Layout.jsx";
import { withApiClient } from "../lib/api.js";
import { Form as SignupForm } from "../modules/signup/Form.jsx";
import { Ticker as ScoreTicker } from "../modules/ui/Ticker.jsx";

const description =
  "Game-day emails for your teams. Pick your team, pick a time, and get an update on game day.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "dotheyplaytoday" },
      { name: "description", content: description },
    ],
  }),
  // the catalog is public and the API is reachable from both runtimes, so this
  // loader is safe on the SSR pass and on client-side navigations alike.
  loader: () => withApiClient((api) => api.subjects.list()).catch(() => []),
  component: Home,
});

function Home() {
  const subjects = Route.useLoaderData();

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
        <SignupForm subjects={subjects()} />
      </section>
    </Layout>
  );
}
