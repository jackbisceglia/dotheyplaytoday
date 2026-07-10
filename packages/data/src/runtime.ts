import * as NodeServices from "@effect/platform-node/NodeServices";
import {
  EventsLayer,
  IdLayer,
  SubjectsLayer,
  SubscriptionsLayer,
  UsersLayer,
} from "@dtpt/core";
import { createConfigProviderFromDotEnv } from "@dtpt/core/lib/config/providers";
import { DatabaseLayer } from "@dtpt/core/lib/database/clients/node/layer";
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
