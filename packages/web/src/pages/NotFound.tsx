import { httpStatus } from "@solidjs/web";

import { Layout } from "../layouts/Layout.jsx";
import { usePageMetadata } from "../lib/metadata.js";

export function NotFound(props: { readonly homeHref: string }) {
  httpStatus(404, "Not Found");
  usePageMetadata(
    "Not found | dotheyplaytoday",
    "The requested page was not found.",
  );

  return (
    <Layout
      homeHref={props.homeHref}
      headerAction={{ href: props.homeHref, label: "Home" }}
    >
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
          <a class="btn btn-secondary" href={props.homeHref}>
            Back home
          </a>
        </div>
      </section>
    </Layout>
  );
}
