import { httpStatus } from "@solidjs/web";
import { Result } from "effect";
import { createMemo } from "solid-js";

import { Layout } from "../layouts/Layout.jsx";
import { usePageMetadata } from "../lib/metadata.js";
import { Confirmation } from "../modules/unsubscribe/Confirmation.jsx";
import { NotFound as UnsubscribeNotFound } from "../modules/unsubscribe/NotFound.jsx";
import { decodeUnsubscribeToken } from "../modules/unsubscribe/token.js";

const description = "Confirm that you want to stop dotheyplaytoday emails.";

export function Unsubscribe(props: {
  readonly homeHref: string;
  readonly token: string;
}) {
  usePageMetadata("Unsubscribe | dotheyplaytoday", description);
  const token = createMemo(() => {
    const result = decodeUnsubscribeToken(props.token);
    if (Result.isFailure(result)) httpStatus(404, "Not Found");
    return result;
  });

  return (
    <Layout
      homeHref={props.homeHref}
      headerAction={{ href: props.homeHref, label: "Home" }}
    >
      {Result.match(token(), {
        onSuccess: (value) => (
          <Confirmation homeHref={props.homeHref} token={value} />
        ),
        onFailure: () => <UnsubscribeNotFound homeHref={props.homeHref} />,
      })}
    </Layout>
  );
}
