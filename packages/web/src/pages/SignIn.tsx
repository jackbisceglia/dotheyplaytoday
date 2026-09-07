import { createEffect, createSignal, Show } from "solid-js";

import { Layout } from "../layouts/Layout.jsx";
import { getAuthClient } from "../lib/auth.js";
import { usePageMetadata } from "../lib/metadata.js";

export function SignIn(props: { readonly homeHref: string }) {
  usePageMetadata(
    "Sign in | dotheyplaytoday",
    "Sign in with a secure email link.",
  );

  const [email, setEmail] = createSignal("");
  const [busy, setBusy] = createSignal(false);
  const [message, setMessage] = createSignal("");
  const [error, setError] = createSignal("");

  createEffect(
    () => undefined,
    () => {
      if (new URLSearchParams(window.location.search).has("error")) {
        setError(
          "This link is invalid, expired, or already used. Request a new link below.",
        );
      }
    },
  );

  const submit = (event: SubmitEvent) => {
    event.preventDefault();

    if (busy()) return;

    setBusy(true);
    setError("");
    setMessage("");

    void getAuthClient()
      .then((auth) =>
        auth.signIn.magicLink({
          email: email().trim().toLowerCase(),
          callbackURL: new URL("/account?confirmed=1", window.location.origin)
            .href,
          errorCallbackURL: new URL("/sign-in", window.location.origin).href,
        }),
      )
      .then((result) => {
        if (result.error) {
          setError(
            result.error.status === 429
              ? "Too many requests. Wait a minute and try again."
              : "We couldn’t request your link. Please try again.",
          );
        } else {
          setMessage(
            "If you have an account, we’ve emailed you a link to sign in. You can request another link here if needed.",
          );
        }
      })
      .catch(() => setError("We couldn’t request your link. Please try again."))
      .finally(() => setBusy(false));
  };

  return (
    <Layout
      homeHref={props.homeHref}
      headerAction={{ href: "/#signup", label: "Sign up" }}
    >
      <section class="feedback-page">
        <div class="feedback-heading">
          <h1 class="feedback-title">Sign in</h1>
          <p class="feedback-copy">
            Enter your email to confirm your updates or sign in. Links expire
            after 15 minutes and can be used once.
          </p>
        </div>
        <Show when={error()}>
          <p class="form-error" role="alert">
            {error()}
          </p>
        </Show>
        <Show when={message()}>
          <p role="status">{message()}</p>
        </Show>
        <form class="feedback-form" onSubmit={submit}>
          <label class="form-label" for="sign-in-email">
            Email address
          </label>
          <input
            id="sign-in-email"
            class="form-input"
            type="email"
            autocomplete="email"
            required
            value={email()}
            onInput={(event) => setEmail(event.currentTarget.value)}
          />
          <button class="btn btn-primary" type="submit" disabled={busy()}>
            {busy() ? "Sending…" : "Email me a link"}
          </button>
        </form>
      </section>
    </Layout>
  );
}
