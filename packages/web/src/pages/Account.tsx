import type { AccountResponse } from "@dtpt/core/contracts/account";
import { Match } from "effect";
import { createEffect, createSignal, For, Show } from "solid-js";
import { Layout } from "../layouts/Layout.jsx";
import { withApiClient } from "../lib/api.js";
import { getAuthClient } from "../lib/auth.js";
import { usePageMetadata } from "../lib/metadata.js";
import { formatSecondsLocal } from "../lib/time.js";

export function Account(props: { readonly homeHref: string }) {
  usePageMetadata(
    "Your account | dotheyplaytoday",
    "Your saved teams and notification schedule.",
  );

  const [account, setAccount] = createSignal<typeof AccountResponse.Type>();
  const [loading, setLoading] = createSignal(true);
  const [signedOut, setSignedOut] = createSignal(false);
  const [error, setError] = createSignal("");
  const [busy, setBusy] = createSignal(false);
  const [confirmed, setConfirmed] = createSignal(false);

  const load = () => {
    setLoading(true);
    setSignedOut(false);
    setAccount(undefined);
    setError("");
    void withApiClient((api) => api.account.get())
      .then(setAccount)
      .catch((error: unknown) =>
        Match.value(error).pipe(
          Match.when({ _tag: "Unauthorized" }, () => setSignedOut(true)),
          Match.orElse(() =>
            setError("We couldn’t load your account. Please try again."),
          ),
        ),
      )
      .finally(() => setLoading(false));
  };

  createEffect(
    () => undefined,
    () => {
      setConfirmed(
        new URLSearchParams(window.location.search).has("confirmed"),
      );
      load();
    },
  );

  const signOut = () => {
    setBusy(true);
    setError("");
    void getAuthClient()
      .then((auth) => auth.signOut())
      .then((result) => {
        if (result.error) throw new Error("Sign-out failed");
        window.location.assign("/sign-in");
      })
      .catch(() => {
        setError("We couldn’t sign you out. Please try again.");
        setBusy(false);
      });
  };

  return (
    <Layout homeHref={props.homeHref}>
      <section class="feedback-page">
        <h1 class="feedback-title">Your account</h1>
        <Show when={loading()}>
          <p role="status">Loading your account…</p>
        </Show>
        <Show when={signedOut()}>
          <p>Sign in to see your saved teams and schedule.</p>
          <a class="btn btn-primary" href="/sign-in">
            Sign in
          </a>
        </Show>
        <Show when={error()}>
          <p class="form-error" role="alert">
            {error()}
          </p>
          <button class="btn btn-secondary" onClick={load}>
            Try again
          </button>
        </Show>
        <Show when={account()}>
          {(saved) => (
            <>
              <Show when={confirmed()}>
                <p role="status">Your email is confirmed. You’re signed in.</p>
              </Show>
              <div class="feedback-heading">
                <p>{saved().user.email}</p>
                <p class="feedback-copy">
                  Timezone: {saved().user.timezone.id}
                </p>
              </div>
              <div class="feedback-heading">
                <h2 class="signup-title">Teams and schedule</h2>
                <For
                  each={saved().subscriptions}
                  fallback={<p>You have no saved teams.</p>}
                >
                  {(subscription) => (
                    <p>
                      {subscription.subject.details.display} —{" "}
                      {formatSecondsLocal(
                        subscription.schedule.sendAtSecondsLocal,
                      )}{" "}
                      on days they play
                    </p>
                  )}
                </For>
              </div>
              <button
                class="btn btn-secondary"
                disabled={busy()}
                onClick={signOut}
              >
                {busy() ? "Signing out…" : "Sign out"}
              </button>
            </>
          )}
        </Show>
      </section>
    </Layout>
  );
}
