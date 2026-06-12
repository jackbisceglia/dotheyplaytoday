import * as NodeServices from "@effect/platform-node/NodeServices";
import {
  DatabaseLayer,
  EventsLayer,
  SubscriptionsLayer,
} from "@dtpt/core-v2";
import { Layer, ManagedRuntime, pipe } from "effect";

import { DotEnvConfigProvider } from "./lib/env.js";

const AppLayer = pipe(
  Layer.mergeAll(SubscriptionsLayer, EventsLayer),
  Layer.provideMerge(DatabaseLayer),
);

const ServerRuntimeLayer = Layer.provideMerge(
  DotEnvConfigProvider,
  NodeServices.layer,
);

export const JobsRuntime = ManagedRuntime.make(
  Layer.mergeAll(AppLayer, ServerRuntimeLayer),
);
