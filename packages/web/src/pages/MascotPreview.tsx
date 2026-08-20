import { For } from "solid-js";

import { usePageMetadata } from "../lib/metadata.js";
import { BrandMark } from "../modules/ui/BrandMark.jsx";

const options = [
  { key: "A", name: "No shadow", shadow: "none" },
  { key: "B", name: "Green outline", shadow: "green" },
  { key: "C", name: "Ink outline", shadow: "ink" },
  { key: "D", name: "Green left shadow", shadow: "offset" },
] as const;

export function MascotPreview() {
  usePageMetadata(
    "Mascot preview — dotheyplaytoday",
    "Mascot headband options",
  );

  return (
    <main class="mascot-preview">
      <header class="mascot-preview-header">
        <div>
          <p class="mascot-preview-kicker">Mascot study</p>
          <h1>Eye shadows</h1>
        </div>
        <p>
          Move your mouse around. Each option is shown large and at its real
          header size.
        </p>
      </header>

      <div class="mascot-preview-grid">
        <For each={options}>
          {(option) => (
            <article class="mascot-preview-card">
              <div class="mascot-preview-stage">
                <BrandMark
                  class="mascot-preview-large"
                  eyeShadow={option.shadow}
                  headband="white"
                />
              </div>
              <footer class="mascot-preview-card-footer">
                <div>
                  <strong>{option.key}</strong>
                  <span>{option.name}</span>
                </div>
                <BrandMark
                  class="wordmark-mark"
                  eyeShadow={option.shadow}
                  headband="white"
                />
              </footer>
            </article>
          )}
        </For>
      </div>
    </main>
  );
}
