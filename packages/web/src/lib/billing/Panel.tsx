import { useSearchParams } from "@solidjs/router";
import { createEffect, createSignal, onCleanup, Show } from "solid-js";

import { withApiClient } from "../api.js";
import type { Preferences } from "../dashboard/preferences.js";

export function BillingPanel(props: {
  readonly billing: Preferences["billing"];
  readonly editing: boolean;
  readonly onRefresh: () => void;
}) {
  const [search, setSearch] = useSearchParams();
  const [pending, setPending] = createSignal(false);
  const [error, setError] = createSignal<string>();
  const [checking, setChecking] = createSignal(false);
  const isPro = () => props.billing.plan === "pro";
  const isGrandfathered = () => props.billing.source === "grandfathered";
  const periodEnd = () =>
    props.billing.periodEnd
      ? new Date(props.billing.periodEnd).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : undefined;

  createEffect(
    () =>
      props.billing.available &&
      (search.billing === "success" || search.billing === "returned"),
    (needsRefresh) => {
      if (!needsRefresh) return;
      setChecking(true);
      let inFlight = false;
      const refresh = async () => {
        if (inFlight) return;
        inFlight = true;
        try {
          await withApiClient((client) => client.billing.sync());
          props.onRefresh();
        } catch {
          setError("We couldn't refresh your plan. Try again in a moment.");
        } finally {
          inFlight = false;
        }
      };
      void refresh();
      let attempts = 0;
      const timer = window.setInterval(() => {
        if (!isPro()) void refresh();
        if (++attempts >= 12) {
          window.clearInterval(timer);
          setChecking(false);
        }
      }, 5000);
      onCleanup(() => {
        window.clearInterval(timer);
        setChecking(false);
      });
    },
  );

  const openBilling = async (action: "upgrade" | "manage") => {
    if (pending() || props.editing || !props.billing.available) return;
    setPending(true);
    setError(undefined);
    try {
      const result = await withApiClient((client) =>
        action === "manage"
          ? client.billing.portal()
          : client.billing.checkout(),
      );
      window.location.assign(result.url);
    } catch {
      setError(
        "We couldn't open billing. Your current plan and picks are safe. Try again in a moment.",
      );
      setPending(false);
    }
  };

  return (
    <aside class="billing-panel" aria-label="Your plan">
      <div>
        <p class="billing-eyebrow">
          {isGrandfathered() ? "Pro · free forever" : isPro() ? "Pro" : "Free"}
        </p>
        <h2 class="billing-title">
          {isPro()
            ? "Room for six teams."
            : "More teams. Same game-day ritual."}
        </h2>
        <p class="billing-copy">
          {isGrandfathered()
            ? "You were here early. Your account includes all six picks, on us."
            : isPro()
              ? props.billing.cancelAtPeriodEnd
                ? `Pro continues until ${periodEnd() ?? "the end of your billing period"}. Then you'll have two Free picks.`
                : "$1.99/month for up to six teams. Manage your payment method or cancel anytime."
              : "Follow two teams for free, or six with Pro for $1.99/month. Cancel anytime."}
        </p>
        <Show when={!props.billing.available && !isGrandfathered()}>
          <p class="form-hint">
            Pro checkout is coming soon. Your current picks are ready to use.
          </p>
        </Show>
        <Show when={props.editing && !isGrandfathered()}>
          <p class="form-hint">
            Save or cancel your edits before opening billing.
          </p>
        </Show>
      </div>
      <Show when={!isGrandfathered() || props.billing.hasBillingCustomer}>
        <div class="billing-actions">
          <Show when={!isPro() && props.billing.canUpgrade}>
            <button
              type="button"
              class="btn btn-primary"
              disabled={pending() || props.editing || !props.billing.available}
              onClick={() => void openBilling("upgrade")}
            >
              {pending() ? "Opening…" : "Get Pro · $1.99/month"}
            </button>
          </Show>
          <Show when={props.billing.hasBillingCustomer}>
            <button
              type="button"
              class="btn btn-secondary"
              disabled={pending() || props.editing || !props.billing.available}
              onClick={() => void openBilling("manage")}
            >
              {pending() ? "Opening…" : "Manage billing"}
            </button>
          </Show>
        </div>
      </Show>
      <Show when={!isPro() && !props.billing.canUpgrade && !isGrandfathered()}>
        <p class="billing-notice" role="status">
          Your Pro subscription needs attention. Open Manage billing to update
          your payment method or subscription.
        </p>
      </Show>
      <Show when={search.billing === "success"}>
        <p class="billing-notice" role="status">
          {isPro()
            ? "You're on Pro. Edit your roster to add up to six teams."
            : checking()
              ? "Confirming your payment and Pro access…"
              : "Your payment is still being confirmed. Refresh your plan in a moment."}
          <Show when={!isPro()}>
            {" "}
            <button
              type="button"
              class="dashboard-edit"
              onClick={() => {
                void withApiClient((client) => client.billing.sync())
                  .then(props.onRefresh)
                  .catch(() =>
                    setError(
                      "We couldn't refresh your plan. Try again in a moment.",
                    ),
                  );
              }}
            >
              Refresh plan
            </button>
          </Show>
          <Show when={isPro()}>
            {" "}
            <button
              type="button"
              class="dashboard-edit"
              onClick={() => {
                setSearch({ billing: undefined }, { replace: true });
              }}
            >
              Dismiss
            </button>
          </Show>
        </p>
      </Show>
      <Show when={search.billing === "canceled"}>
        <p class="billing-notice" role="status">
          Checkout canceled. Your plan and teams haven't changed.
        </p>
      </Show>
      <Show when={error()}>
        {(message) => (
          <p class="form-error billing-notice" role="alert">
            {message()}
          </p>
        )}
      </Show>
    </aside>
  );
}
