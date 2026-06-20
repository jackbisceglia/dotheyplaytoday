import * as NodeServices from "@effect/platform-node/NodeServices";
import { DatabaseLayer, SubscriptionsLayer, UsersLayer } from "@dtpt/core-v2";
import { createConfigProviderFromDotEnv } from "@dtpt/core-v2/lib/config/providers";
import { Layer, ManagedRuntime, pipe } from "effect";

import { RateLimiterLayer } from "./rate-limit/service.js";

export const DotEnvConfigProvider = createConfigProviderFromDotEnv();

export const ApiRuntime = ManagedRuntime.make(
  pipe(
    Layer.mergeAll(SubscriptionsLayer, UsersLayer, RateLimiterLayer),
    Layer.provideMerge(DatabaseLayer),
    Layer.provideMerge(DotEnvConfigProvider),
    Layer.provideMerge(NodeServices.layer),
  ),
);
