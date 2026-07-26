import { createFileRoute, notFound } from "@tanstack/solid-router";
import { Result } from "effect";
import type { ParentProps } from "solid-js";

import { Layout } from "../layouts/Layout.jsx";
import { Confirmation } from "../modules/unsubscribe/Confirmation.jsx";
import { NotFound } from "../modules/unsubscribe/NotFound.jsx";
import { decodeUnsubscribeToken } from "../modules/unsubscribe/token.js";

const description = "Confirm that you want to stop dotheyplaytoday emails.";

function UnsubscribeLayout(props: ParentProps) {
  return (
    <Layout headerAction={{ href: "/", label: "Home" }}>
      {props.children}
    </Layout>
  );
}

export const Route = createFileRoute("/unsubscribe/$token")({
  head: () => ({
    meta: [
      { title: "Unsubscribe | dotheyplaytoday" },
      { name: "description", content: description },
    ],
  }),
  // decoding is pure, so it runs identically on the SSR pass and on client
  // navigations; an undecodable token becomes a real 404 response.
  loader: ({ params }) => {
    const token = decodeUnsubscribeToken(params.token);

    // TanStack signals not-found with a plain marker object, not an Error
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    if (Result.isFailure(token)) throw notFound();

    return { token: token.success };
  },
  notFoundComponent: () => (
    <UnsubscribeLayout>
      <NotFound />
    </UnsubscribeLayout>
  ),
  component: Unsubscribe,
});

function Unsubscribe() {
  const data = Route.useLoaderData();

  return (
    <UnsubscribeLayout>
      <Confirmation token={data().token} />
    </UnsubscribeLayout>
  );
}
