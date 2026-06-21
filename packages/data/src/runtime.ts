import * as NodeServices from "@effect/platform-node/NodeServices";
import {
  DatabaseLayer,
  EventsLayer,
  IdLayer,
  SubjectsLayer,
  SubscriptionsLayer,
  UsersLayer,
} from "@dtpt/core";
import { createConfigProviderFromDotEnv } from "@dtpt/core/lib/config/providers";
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
