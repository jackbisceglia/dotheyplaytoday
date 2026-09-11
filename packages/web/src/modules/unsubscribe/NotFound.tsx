import { useApplicationPath } from "../../lib/paths.js";

export function NotFound() {
  const homeHref = useApplicationPath("home");
  return (
    <section class="unsubscribe">
      <div class="unsubscribe-confirm">
        <h1 class="unsubscribe-title">
          This link
          <br />
          <em>can't be used.</em>
        </h1>
        <p class="unsubscribe-copy">
          This unsubscribe link is invalid or expired. Grab a fresh one from a
          dotheyplaytoday email to stop future messages.
        </p>
        <a class="btn btn-secondary" href={homeHref}>
          Back home
        </a>
      </div>
    </section>
  );
}
