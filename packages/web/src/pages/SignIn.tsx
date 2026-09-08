import { createSignal, Show } from "solid-js";

import { Layout } from "../layouts/Layout.jsx";
import { auth } from "../lib/auth.js";
import { usePageMetadata } from "../lib/metadata.js";

export function SignIn() {
  usePageMetadata(
    "Sign in | dotheyplaytoday",
    "Get a link to sign in to your account.",
  );
  const [email, setEmail] = createSignal("");
  const [sending, setSending] = createSignal(false);
  const [sent, setSent] = createSignal(false);
  const [error, setError] = createSignal<string>();
  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    setSending(true);
    setError(undefined);
    void auth.signIn
      .magicLink({ email: email() })
      .then((result) => {
        if (result.error)
          throw new Error(result.error.message, { cause: result.error });
        setSent(true);
      })
      .catch(() =>
        setError("We couldn’t request your link. Please try again shortly."),
      )
      .finally(() => setSending(false));
  };
  return (
    <Layout homeHref="/" headerAction={{ href: "/", label: "Sign up" }}>
      <section class="signup">
        <h1 class="signup-title">Sign in</h1>
        <Show
          when={!sent()}
          fallback={
            <p role="status">
              If you have an account, check your email for a link to sign in.
            </p>
          }
        >
          <form class="feedback-form" onSubmit={submit}>
            <div class="form-field">
              <label class="form-label" for="sign-in-email">
                Email
              </label>
              <input
                class="form-input"
                id="sign-in-email"
                type="email"
                autocomplete="email"
                required
                value={email()}
                onInput={(event) => setEmail(event.currentTarget.value)}
              />
            </div>
            <button class="btn btn-primary" type="submit" disabled={sending()}>
              {sending() ? "Sending..." : "Email me a link"}
            </button>
            <Show when={error()}>
              <p class="form-error" role="alert">
                {error()}
              </p>
            </Show>
          </form>
        </Show>
      </section>
    </Layout>
  );
}
