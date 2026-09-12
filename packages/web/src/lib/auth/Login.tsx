import { EmailAddressFromString } from "@dtpt/core/modules/users/schema";
import { useNavigate } from "@solidjs/router";
import { Result, Schema } from "effect";
import { createSignal, Show } from "solid-js";

import { auth } from "../auth.js";
import { useApplicationPath } from "../paths.js";

const decodeEmail = Schema.decodeUnknownResult(EmailAddressFromString);

export function Login() {
  const navigate = useNavigate();
  const landingHref = useApplicationPath("landing");
  const [email, setEmail] = createSignal("");
  const [error, setError] = createSignal<string>();
  const [isPending, setIsPending] = createSignal(false);
  const [isSent, setIsSent] = createSignal(false);

  const close = () => {
    navigate(landingHref(), { replace: true });
  };

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    const decoded = decodeEmail(email());

    if (Result.isFailure(decoded)) {
      setError("Enter a valid email address.");
      return;
    }

    setError(undefined);
    setIsPending(true);
    const result = await auth.signIn.magicLink({ email: decoded.success });
    setIsPending(false);

    if (result.error) {
      setError("We couldn't send your link. Try again.");
      return;
    }

    setIsSent(true);
  };

  return (
    <div class="modal-backdrop" role="presentation" onClick={close}>
      <section
        aria-labelledby="login-title"
        aria-modal="true"
        class="login-modal"
        role="dialog"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <button
          class="modal-close"
          type="button"
          aria-label="Close"
          onClick={close}
        >
          ×
        </button>
        <Show
          when={!isSent()}
          fallback={
            <>
              <h2 class="login-title" id="login-title">
                Check your <em>inbox.</em>
              </h2>
              <p class="login-copy">
                We sent a sign-in link to <strong>{email()}</strong>.
              </p>
              <button
                class="login-reset"
                type="button"
                onClick={() => setIsSent(false)}
              >
                Sign in with a different email
              </button>
            </>
          }
        >
          <h2 class="login-title" id="login-title">
            Welcome <em>back.</em>
          </h2>
          <p class="login-copy">We'll email you a link to sign in.</p>
          <form
            class="login-form"
            onSubmit={(event) => {
              void submit(event);
            }}
          >
            <label class="visually-hidden" for="login-email">
              Email
            </label>
            <input
              class="form-input"
              id="login-email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              value={email()}
              onInput={(event) => setEmail(event.currentTarget.value)}
              autofocus
            />
            <button
              class="btn btn-primary"
              type="submit"
              disabled={isPending()}
            >
              {isPending() ? "Sending…" : "Send link"}
            </button>
            <Show when={error()}>
              {(message) => (
                <p class="form-error" role="alert">
                  {message()}
                </p>
              )}
            </Show>
          </form>
        </Show>
      </section>
    </div>
  );
}
