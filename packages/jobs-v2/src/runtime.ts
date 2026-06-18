import * as NodeServices from "@effect/platform-node/NodeServices";
import {
  DatabaseLayer,
  EventsLayer,
  SubscriptionsLayer,
} from "@dtpt/core-v2";
import { createConfigProviderFromDotEnv } from "@dtpt/core-v2/lib/config/providers";
import { Layer, ManagedRuntime, pipe } from "effect";

export const DotEnvConfigProvider = createConfigProviderFromDotEnv(
  new URL("../../../.env", import.meta.url),
);

export const JobsRuntime = ManagedRuntime.make(
  pipe(
    Layer.mergeAll(SubscriptionsLayer, EventsLayer),
    Layer.provideMerge(DatabaseLayer),
    Layer.provideMerge(DotEnvConfigProvider),
    Layer.provideMerge(NodeServices.layer),
  ),
);
