import * as NodeServices from "@effect/platform-node/NodeServices";
import { createConfigProviderFromDotEnv } from "@dtpt/core/lib/config/providers";
import { DatabaseLayer } from "@dtpt/core/lib/database/node";
import { IdLayer } from "@dtpt/core/lib/id/service";
import { EventsLayer } from "@dtpt/core/modules/events/service";
import { SubjectsLayer } from "@dtpt/core/modules/subjects/service";
import { SubscriptionsLayer } from "@dtpt/core/modules/subscriptions/service";
import { UsersLayer } from "@dtpt/core/modules/users/service";
import { Layer, ManagedRuntime, pipe } from "effect";

export const DotEnvConfigProvider = createConfigProviderFromDotEnv();

export const DataRuntime = ManagedRuntime.make(
  pipe(
    Layer.mergeAll(SubjectsLayer, EventsLayer, UsersLayer, SubscriptionsLayer),
    Layer.provideMerge(DatabaseLayer),
    Layer.provide(IdLayer),
    Layer.provideMerge(DotEnvConfigProvider),
    Layer.provideMerge(NodeServices.layer),
  ),
);
