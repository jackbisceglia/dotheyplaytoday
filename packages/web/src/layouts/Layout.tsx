import { createEffect, createSignal, Show } from "solid-js";
import type { ParentProps } from "solid-js";

import { getAuthClient } from "../lib/auth.js";
import { BrandMark } from "../modules/ui/BrandMark.jsx";

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

  const [signedIn, setSignedIn] = createSignal(false);

  createEffect(
    () => undefined,
    () => {
      void getAuthClient()
        .then((auth) => auth.getSession())
        .then((result) => {
          setSignedIn(Boolean(result.data));
        })
        .catch(() => setSignedIn(false));
    },
  );

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
          <BrandMark class="wordmark-mark" />
          <span class="visually-hidden">Do they play today</span>
          <span aria-hidden="true">
            dothey<em>play</em>today
          </span>
        </a>
        <div class="site-header-actions">
          <a class="header-cta" href={signedIn() ? "/account" : "/sign-in"}>
            {signedIn() ? "Your account" : "Sign in"}
          </a>
          <Show when={!signedIn() && props.headerAction}>
            {(action) => (
              <a class="header-cta" href={action().href}>
                {action().label}
              </a>
            )}
          </Show>
        </div>
      </header>

      <main id="main-content" tabindex="-1" ref={main}>
        {props.children}
      </main>

      <footer class="site-footer">
        <span>dotheyplaytoday</span>
        <a class="footer-link" href="/feedback">
          Feedback
        </a>
      </footer>
    </>
  );
}
