import { httpStatus } from "@solidjs/web";
import { Result } from "effect";

import { Layout } from "../layouts/Layout.jsx";
import { usePageMetadata } from "../lib/metadata.js";
import { useApplicationPath } from "../lib/paths.js";
import { Confirmation } from "../modules/unsubscribe/Confirmation.jsx";
import { NotFound as UnsubscribeNotFound } from "../modules/unsubscribe/NotFound.jsx";
import { decodeUnsubscribeToken } from "../modules/unsubscribe/token.js";

const description = "Confirm that you want to stop dotheyplaytoday emails.";

export function Unsubscribe(props: { readonly token?: string }) {
  const landingHref = useApplicationPath("landing");
  usePageMetadata("Unsubscribe | dotheyplaytoday", description);
  const token = props.token
    ? decodeUnsubscribeToken(props.token)
    : Result.succeed(undefined);
  if (Result.isFailure(token)) httpStatus(404, "Not Found");

  return (
    <Layout headerActions={[{ href: landingHref(), label: "Home" }]}>
      {Result.match(token, {
        onSuccess: (value) => <Confirmation token={value} />,
        onFailure: () => <UnsubscribeNotFound />,
      })}
    </Layout>
  );
}
