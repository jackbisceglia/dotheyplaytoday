import { Link } from "@tanstack/solid-router";
import type { ParentProps } from "solid-js";
import { Show } from "solid-js";

type HeaderAction = {
  readonly href: string;
  readonly label: string;
};

type LayoutProps = ParentProps<{
  // passed as data rather than as a JSX element: Solid assigns hydration keys
  // in evaluation order, and an element built in the caller is created at a
  // different point on the server than on the client.
  readonly headerAction?: HeaderAction;
}>;

export function Layout(props: LayoutProps) {
  return (
    <>
      <a class="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header class="site-header">
        <Link class="wordmark" to="/">
          <span class="visually-hidden">Do they play today</span>
          <span aria-hidden="true">
            dothey<em>play</em>today
          </span>
        </Link>
        <Show when={props.headerAction}>
          {(action) => (
            <div class="site-header-actions">
              <a class="header-cta" href={action().href}>
                {action().label}
              </a>
            </div>
          )}
        </Show>
      </header>

      <main id="main-content">{props.children}</main>

      <footer class="site-footer">
        <span>dotheyplaytoday</span>
      </footer>
    </>
  );
}
