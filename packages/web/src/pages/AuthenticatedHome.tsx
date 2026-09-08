import { useNavigate } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";

import { Layout } from "../layouts/Layout.jsx";
import { consumeConfirmation, getAuthClient } from "../lib/auth.js";
import { usePageMetadata } from "../lib/metadata.js";

export function AuthenticatedHome() {
  usePageMetadata("Home | dotheyplaytoday", "Your game-day updates.");
  const navigate = useNavigate();
  const [user, setUser] = createSignal<{
    email: string;
    emailVerified: boolean;
  }>();
  const [confirmed, setConfirmed] = createSignal(false);
  const [linkFailed, setLinkFailed] = createSignal(false);
  const [error, setError] = createSignal(false);

  createEffect(
    () => undefined,
    () => {
      let active = true;
      void getAuthClient()
        .then((client) => client.getSession())
        .then((result) => {
          if (!active) return;
          if (result.error)
            throw new Error(result.error.message, { cause: result.error });
          if (!result.data) {
            navigate("/sign-in", { replace: true });
            return;
          }
          setUser(result.data.user);
          setLinkFailed(
            new URLSearchParams(window.location.search).has("error"),
          );
          setConfirmed(
            consumeConfirmation(
              new URL(window.location.href),
              result.data.user,
              window.history,
            ),
          );
        })
        .catch(() => {
          if (active) setError(true);
        });
      return () => {
        active = false;
      };
    },
  );

  return (
    <Layout
      homeHref="/home"
      headerAction={{ href: "/feedback", label: "Feedback" }}
    >
      <section class="signup">
        <Show when={error()}>
          <p class="form-error" role="alert">
            We couldn’t check your session. Refresh to try again.
          </p>
        </Show>
        <Show
          when={user()}
          fallback={
            <Show when={!error()}>
              <p>Checking your session...</p>
            </Show>
          }
        >
          <Show when={linkFailed()}>
            <p class="form-error" role="alert">
              This link is invalid or has expired.{" "}
              <a href="/sign-in">Request a new link</a>.
            </p>
          </Show>
          <Show when={confirmed()}>
            <p class="confirmation-banner" role="status">
              Welcome to dotheyplaytoday! Your email is confirmed.
            </p>
          </Show>
          <h1 class="signup-title">Your game-day updates</h1>
          <p>Signed in as {user()?.email}.</p>
          <p>
            {user()?.emailVerified
              ? "Your saved teams and schedule are ready for game day."
              : "Confirm your email to start your updates."}
          </p>
        </Show>
      </section>
    </Layout>
  );
}
