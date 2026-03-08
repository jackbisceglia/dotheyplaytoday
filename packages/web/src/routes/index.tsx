import { Title } from "@solidjs/meta";
import { createSignal, onMount } from "solid-js";

import { pingApi } from "~/lib/api-client";

type ApiStatus = "checking" | "ok" | "error";

type Scorebug = {
  shift: "a" | "b" | "c" | "d";
  state: "off" | "today";
  team: string;
  marker?: "vs" | "@";
  opponent?: string;
};

const scorebugs: readonly Scorebug[] = [
  { shift: "a", state: "off", team: "LAL" },
  { shift: "c", state: "today", team: "CHI", marker: "vs", opponent: "MIL" },
  { shift: "b", state: "today", team: "BOS", marker: "@", opponent: "BKN" },
  { shift: "d", state: "off", team: "DAL" },
  { shift: "a", state: "off", team: "NYK" },
  { shift: "c", state: "today", team: "ATL", marker: "@", opponent: "ORL" },
  { shift: "b", state: "off", team: "PHX" },
  { shift: "d", state: "off", team: "SAS" },
  { shift: "a", state: "today", team: "MIN", marker: "vs", opponent: "SAC" },
  { shift: "c", state: "off", team: "MIA" },
];

export default function Home() {
  const [status, setStatus] = createSignal<ApiStatus>("checking");
  const [message, setMessage] = createSignal("");

  const checkApi = async () => {
    setStatus("checking");
    setMessage("");

    try {
      const response = await pingApi();
      setStatus("ok");
      setMessage(`${response.service} is live`);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Could not reach the API.",
      );
    }
  };

  onMount(() => {
    void checkApi();
  });

  const scrollToSignup = () => {
    document
      .getElementById("signup")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main class="page">
      <Title>Do They Play Today</Title>

      <header class="site-header">
        <span class="logo">Do They Play Today</span>
        <span class="tagline">Game day alerts, zero noise</span>
      </header>

      <section class="hero">
        <h1 class="hero-headline">
          Do They
          <br />
          <em>Play</em>
          <br />
          Today?
        </h1>

        <div class="hero-right">
          <p class="hero-body">
            Find out if your team has a game today - and get an email when they
            do. No noise on off days.
          </p>

          <button class="btn-primary" onClick={scrollToSignup}>
            Get notified
          </button>
        </div>

        <div class="hero-scorebugs" aria-hidden="true">
          <div class="scorebug-track">
            {[...scorebugs, ...scorebugs].map((scorebug) => (
              <div
                class={`scorebug is-shift-${scorebug.shift}`}
                data-state={scorebug.state}
              >
                <div class="scorebug-copy">
                  <span class="scorebug-team">{scorebug.team}</span>
                  {scorebug.state === "today" ? (
                    <span class="scorebug-matchup">
                      {scorebug.marker} {scorebug.opponent}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="signup-section" id="signup">
        <p class="section-label">API Status</p>

        <div class="status-row">
          <div class="status-pill" data-state={status()}>
            <span class="status-dot" />
            {status() === "checking"
              ? "Checking"
              : status() === "ok"
                ? "Online"
                : "Offline"}
          </div>
          {message() && <p class="status-message">{message()}</p>}
        </div>

        <div class="signup-actions">
          <button
            class="btn-ghost"
            onClick={() => void checkApi()}
            disabled={status() === "checking"}
          >
            {status() === "checking" ? "Checking..." : "Ping API"}
          </button>
        </div>
      </section>

      <footer class="site-footer">
        <p>Built for the days that matter.</p>
        <p>Celtics first. Any recurring schedule next.</p>
      </footer>
    </main>
  );
}
