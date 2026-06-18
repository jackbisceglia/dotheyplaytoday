import * as NodeServices from "@effect/platform-node/NodeServices";
import {
  DatabaseLayer,
  EventsLayer,
  SubscriptionsLayer,
} from "@dtpt/core-v2";
import { Layer, ManagedRuntime, pipe } from "effect";

import { DotEnvConfigProvider } from "./lib/env.js";

export const JobsRuntime = ManagedRuntime.make(
  pipe(
    Layer.mergeAll(SubscriptionsLayer, EventsLayer),
    Layer.provideMerge(DatabaseLayer),
    Layer.provideMerge(DotEnvConfigProvider),
    Layer.provideMerge(NodeServices.layer),
  ),
);
