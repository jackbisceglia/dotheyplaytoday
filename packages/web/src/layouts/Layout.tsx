import { For, Show } from "solid-js";
import type { ParentProps } from "solid-js";
import { BrandMark } from "../lib/ui/BrandMark.jsx";
import { useApplicationPath } from "../lib/paths.js";

// TODO(layout): fold this chrome into the root shell (pages/shell.tsx) and
// delete this module. Every page wraps itself in Layout today; the shell
// should own the header/footer once per navigation instead.
type HeaderAction = {
  readonly label: string;
  /** Omit for the default outlined button; pages with two actions rank them. */
  readonly variant?: "quiet" | "solid";
} & (
  | { readonly href: string; readonly onClick?: never }
  | { readonly href?: never; readonly onClick: () => void }
);

type LayoutProps = ParentProps<{
  readonly headerActions?: readonly HeaderAction[];
  readonly unsubscribeHref?: string;
}>;

function headerActionClass(action: HeaderAction) {
  return action.variant
    ? `header-cta header-cta-${action.variant}`
    : "header-cta";
}

export function Layout(props: LayoutProps) {
  let main: HTMLElement | undefined;
  const landingHref = useApplicationPath("landing");
  const feedbackHref = useApplicationPath("feedback");

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
        <a class="wordmark" href={landingHref()}>
          <BrandMark class="wordmark-mark" />
          <span class="visually-hidden">Do they play today</span>
          <span class="wordmark-text" aria-hidden="true">
            dothey<em>play</em>today
          </span>
        </a>
        <Show when={props.headerActions?.length}>
          <div class="site-header-actions">
            <For each={props.headerActions}>
              {(action) => (
                <Show
                  when={action.href}
                  fallback={
                    <button
                      class={headerActionClass(action)}
                      type="button"
                      onClick={action.onClick}
                    >
                      {action.label}
                    </button>
                  }
                >
                  {(href) => (
                    <a class={headerActionClass(action)} href={href()}>
                      {action.label}
                    </a>
                  )}
                </Show>
              )}
            </For>
          </div>
        </Show>
      </header>

      <main id="main-content" tabindex="-1" ref={main}>
        {props.children}
      </main>

      <footer class="site-footer">
        <span>dotheyplaytoday</span>
        <div class="site-footer-links">
          <Show when={props.unsubscribeHref}>
            {(href) => (
              <a class="footer-link" href={href()}>
                Unsubscribe
              </a>
            )}
          </Show>
          <a class="footer-link" href={feedbackHref()}>
            Feedback
          </a>
        </div>
      </footer>
    </>
  );
}
