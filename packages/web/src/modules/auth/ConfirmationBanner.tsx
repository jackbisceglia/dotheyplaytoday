import { useLocation, useSearchParams } from "@solidjs/router";
import { createEffect, Show, untrack, useContext } from "solid-js";

import { UserContext } from "../../lib/session.js";

export function ConfirmationBanner() {
  const user = useContext(UserContext);
  const location = useLocation();
  const [search, setSearch] = useSearchParams();
  const showConfirmation = untrack(
    () =>
      search.confirmed === "1" &&
      user().emailVerified &&
      search.error === undefined,
  );

  createEffect(
    () => ({ confirmed: search.confirmed, state: location.state }),
    ({ confirmed, state }) => {
      if (confirmed !== undefined) {
        setSearch({ confirmed: undefined }, { replace: true, state });
      }
    },
  );

  return (
    <Show when={showConfirmation}>
      <p class="confirmation-banner" role="status">
        Welcome to dotheyplaytoday! Your email is confirmed.
      </p>
    </Show>
  );
}
