import { HydrationScript } from "@solidjs/web";
import type { ParentProps } from "solid-js";

import { AuthHintKey } from "./lib/auth/hint.js";
import { paths } from "./lib/paths.js";

const authHintScript = `try{if(location.pathname==="${paths.landing}"&&localStorage.getItem("${AuthHintKey}")==="1")location.replace("${paths.home}")}catch{}`;

export default function Document(props: ParentProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
        <script>{authHintScript}</script>
        <HydrationScript />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
