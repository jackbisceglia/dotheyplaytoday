import * as NodeServices from "@effect/platform-node/NodeServices";
import { createConfigProviderFromDotEnv } from "@dtpt/core/lib/config/providers";
import { DatabaseLayer } from "@dtpt/core/lib/database/clients/node/layer";
import { IdLayer } from "@dtpt/core/lib/id/service";
import { EventsLayer } from "@dtpt/core/modules/events/service";
import { SubscriptionsLayer } from "@dtpt/core/modules/subscriptions/service";
import { Layer, ManagedRuntime, pipe } from "effect";

export const DotEnvConfigProvider = createConfigProviderFromDotEnv();

export const JobsRuntime = ManagedRuntime.make(
  pipe(
    Layer.mergeAll(SubscriptionsLayer, EventsLayer),
    Layer.provideMerge(DatabaseLayer),
    Layer.provide(IdLayer),
    Layer.provideMerge(DotEnvConfigProvider),
    Layer.provideMerge(NodeServices.layer),
  ),
);
