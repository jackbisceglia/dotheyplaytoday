import { useSearchParams } from "@solidjs/router";
import { Show } from "solid-js";

import { Router } from "../../router.js";

export function MagicLinkError(props: { readonly banner?: boolean }) {
  const [search] = useSearchParams();

  return (
    <Show when={search.error !== undefined}>
      <p
        class={props.banner ? "form-error form-error-banner" : "form-error"}
        role="alert"
      >
        This link is invalid or has expired.{" "}
        <a href={Router.paths["sign-in"]()}>Request a new link</a>.
      </p>
    </Show>
  );
}
