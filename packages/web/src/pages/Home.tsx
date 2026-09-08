import { useContext } from "solid-js";

import { Layout } from "../layouts/Layout.jsx";
import { usePageMetadata } from "../lib/metadata.js";
import { UserContext } from "../lib/session.js";
import { ConfirmationBanner } from "../modules/auth/ConfirmationBanner.jsx";
import { MagicLinkError } from "../modules/auth/MagicLinkError.jsx";
import { Router } from "../router.js";

export default function Home() {
  const user = useContext(UserContext);
  usePageMetadata("Home | dotheyplaytoday", "Your game-day updates.");

  return (
    <Layout
      homeHref={Router.paths.home()}
      headerAction={{ href: Router.paths.feedback(), label: "Feedback" }}
    >
      <section class="signup">
        <MagicLinkError />
        <ConfirmationBanner />
        <h1 class="signup-title">Your game-day updates</h1>
        <p>Signed in as {user().email}.</p>
        <p>
          {user().emailVerified
            ? "Your saved teams and schedule are ready for game day."
            : "Confirm your email to start your updates."}
        </p>
      </section>
    </Layout>
  );
}
