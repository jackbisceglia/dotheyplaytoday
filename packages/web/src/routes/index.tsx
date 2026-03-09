import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";

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
  return (
    <main class="page">
      <Title>Do They Play Today</Title>

      <header class="site-header">
        <A class="logo" href="/" aria-label="Do They Play Today home">
          DTPT
        </A>
      </header>

      <section class="hero">
        <div class="hero-top">
          <h1 class="hero-headline">
            Do They
            <br />
            <em>Play</em>
            <br />
            Today?
          </h1>

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
        </div>

        <div class="hero-details">
          <p class="hero-body">
            Pick your team. Pick your schedule. We'll ping you on game days.
          </p>

          <button class="btn-primary" type="button">
            Get notified
          </button>
        </div>
      </section>
    </main>
  );
}
