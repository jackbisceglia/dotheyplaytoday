import * as NodeServices from "@effect/platform-node/NodeServices";
import { DatabaseLayer, SubscriptionsLayer, UsersLayer } from "@dtpt/core-v2";
import { Layer, ManagedRuntime, pipe } from "effect";

import { DotEnvConfigProvider } from "./lib/env.js";
import { RateLimiterLayer } from "./rate-limit/service.js";

const AppLayer = pipe(
  Layer.mergeAll(SubscriptionsLayer, UsersLayer, RateLimiterLayer),
  Layer.provideMerge(DatabaseLayer),
);

const ServerRuntimeLayer = Layer.provideMerge(
  DotEnvConfigProvider,
  NodeServices.layer,
);

export const ApiRuntime = ManagedRuntime.make(
  Layer.mergeAll(AppLayer, ServerRuntimeLayer),
);
