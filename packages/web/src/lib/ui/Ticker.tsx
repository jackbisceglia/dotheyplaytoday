import { For } from "solid-js";

const matchups = [
  "BOS @ NYK · 7:30 PM",
  "MIL vs CHI · 8:00 PM",
  "DEN @ MIN · 9:00 PM",
  "GSW vs LAL · 10:00 PM",
  "OKC vs SAS · 8:00 PM",
  "MIA @ ORL · 7:00 PM",
  "PHI vs TOR · 7:30 PM",
  "SAC @ POR · 10:00 PM",
];

export function Ticker() {
  return (
    <div class="ticker" aria-hidden="true">
      <div class="ticker-track">
        <For each={[...matchups, ...matchups]}>
          {(matchup) => (
            <span class="ticker-item">
              <span class="ticker-dot">●</span>
              {matchup}
            </span>
          )}
        </For>
      </div>
    </div>
  );
}
