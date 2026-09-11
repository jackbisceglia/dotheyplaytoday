import { httpStatus } from "@solidjs/web";

import { Layout } from "../layouts/Layout.jsx";
import { usePageMetadata } from "../lib/metadata.js";
import { useApplicationPath } from "../lib/paths.js";

export function NotFound() {
  const homeHref = useApplicationPath("home");
  httpStatus(404, "Not Found");
  usePageMetadata(
    "Not found | dotheyplaytoday",
    "The requested page was not found.",
  );

  return (
    <Layout headerAction={{ href: homeHref, label: "Home" }}>
      <section class="unsubscribe">
        <div class="unsubscribe-confirm">
          <h1 class="unsubscribe-title">
            This page
            <br />
            <em>can't be found.</em>
          </h1>
          <p class="unsubscribe-copy">
            The page you requested doesn't exist. Head home to pick your teams.
          </p>
          <a class="btn btn-secondary" href={homeHref}>
            Back home
          </a>
        </div>
      </section>
    </Layout>
  );
}
