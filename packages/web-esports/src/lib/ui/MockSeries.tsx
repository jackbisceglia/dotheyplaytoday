import { getCodLogo } from "../catalog/esports/cod.js";

// Decorative sample series, like the sports landing page's ticker.
export function MockSeries() {
  return (
    <div class="scorebug" aria-hidden="true">
      <span class="scorebug-label">Up next</span>
      <div class="scorebug-team">
        <span class="scorebug-glyph">{getCodLogo("TX")}</span>
        <span>
          <span class="scorebug-abbr">TX</span>
          <span class="scorebug-name">OpTic Texas</span>
        </span>
      </div>
      <div class="scorebug-middle">
        <span class="scorebug-vs">VS</span>
        <span class="scorebug-time">3:00 PM ET</span>
      </div>
      <div class="scorebug-team">
        <span class="scorebug-glyph">{getCodLogo("VGS")}</span>
        <span>
          <span class="scorebug-abbr">VGS</span>
          <span class="scorebug-name">FaZe Vegas</span>
        </span>
      </div>
    </div>
  );
}
