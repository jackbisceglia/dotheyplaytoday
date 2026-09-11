import { useNavigate } from "@solidjs/router";

import { auth, useSession } from "../../lib/auth.js";
import { Layout } from "../../layouts/Layout.jsx";
import { usePageMetadata } from "../../lib/metadata.js";

export function Home() {
  const session = useSession();
  const navigate = useNavigate();
  usePageMetadata("Home | dotheyplaytoday", "Your game-day subscriptions.");

  const signOut = () => {
    void auth.signOut().finally(() => {
      navigate("/", { replace: true });
    });
  };

  return (
    <Layout headerAction={{ href: "#subscriptions", label: "Subscriptions" }}>
      <section class="unsubscribe">
        <div class="unsubscribe-confirm">
          <h1 class="unsubscribe-title">
            You're
            <br />
            <em>on the roster.</em>
          </h1>
          <p class="unsubscribe-copy">
            Signed in as {session().data?.user.email ?? "you"}.
          </p>
          <button class="btn btn-secondary" type="button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </section>
    </Layout>
  );
}
