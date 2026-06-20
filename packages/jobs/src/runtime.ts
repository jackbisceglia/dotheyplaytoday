import * as NodeServices from "@effect/platform-node/NodeServices";
import {
  DatabaseLayer,
  EventsLayer,
  SubscriptionsLayer,
} from "@dtpt/core";
import { createConfigProviderFromDotEnv } from "@dtpt/core/lib/config/providers";
import { Layer, ManagedRuntime, pipe } from "effect";

export const DotEnvConfigProvider = createConfigProviderFromDotEnv();

export const JobsRuntime = ManagedRuntime.make(
  pipe(
    Layer.mergeAll(SubscriptionsLayer, EventsLayer),
    Layer.provideMerge(DatabaseLayer),
    Layer.provideMerge(DotEnvConfigProvider),
    Layer.provideMerge(NodeServices.layer),
  ),
);
