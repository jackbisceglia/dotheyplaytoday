import { Stack } from "alchemy";
import { adopt } from "alchemy/AdoptPolicy";
import * as Cloudflare from "alchemy/Cloudflare";
import { retain } from "alchemy/RemovalPolicy";
import { Duration, Effect } from "effect";

import { domain } from "../domain.js";

/** The shared Cloudflare zone and its zone-wide production settings. */
export const Domain = Effect.gen(function* () {
  const stack = yield* Stack;

  const zone =
    stack.stage === "production"
      ? yield* Cloudflare.Zone.Zone("Domain", {
          name: domain,
          paused: false,
          type: "full",
          vanityNameServers: [],
        }).pipe(adopt(), retain())
      : yield* Cloudflare.Zone.Zone.ref("Domain", { stage: "production" });

  if (stack.stage === "production") {
    yield* Cloudflare.Zone.Setting("AlwaysUseHttps", {
      zoneId: zone.zoneId,
      settingId: "always_use_https",
      value: "on",
    });

    yield* Cloudflare.Zone.Setting("StrictTransportSecurity", {
      zoneId: zone.zoneId,
      settingId: "security_header",
      value: {
        strictTransportSecurity: {
          enabled: true,
          includeSubdomains: false,
          maxAge: Duration.toSeconds("30 days"),
          nosniff: true,
          preload: false,
        },
      },
    });
  }

  return zone;
});
