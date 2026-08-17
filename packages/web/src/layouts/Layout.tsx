import { Show } from "solid-js";
import type { ParentProps } from "solid-js";

type HeaderAction = {
  readonly href: string;
  readonly label: string;
};

type LayoutProps = ParentProps<{
  readonly homeHref: string;
  readonly headerAction?: HeaderAction;
}>;

export function Layout(props: LayoutProps) {
  let main: HTMLElement | undefined;

  return (
    <>
      <a
        class="skip-link"
        href="#main-content"
        onClick={() => {
          queueMicrotask(() => main?.focus());
        }}
      >
        Skip to main content
      </a>

      <header class="site-header">
        <a class="wordmark" href={props.homeHref}>
          <span class="visually-hidden">Do they play today</span>
          <span aria-hidden="true">
            dothey<em>play</em>today
          </span>
        </a>
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

      <main id="main-content" tabindex="-1" ref={main}>
        {props.children}
      </main>

      <footer class="site-footer">
        <span>dotheyplaytoday</span>
      </footer>
    </>
  );
}
