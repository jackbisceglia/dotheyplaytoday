import * as NodeServices from "@effect/platform-node/NodeServices";
import {
  DatabaseLayer,
  EventsLayer,
  SubjectsLayer,
  SubscriptionsLayer,
  UsersLayer,
} from "@dtpt/core-v2";
import { Layer, ManagedRuntime, pipe } from "effect";

import { DotEnvConfigProvider } from "./lib/env.js";

const AppLayer = pipe(
  Layer.mergeAll(SubjectsLayer, EventsLayer, UsersLayer, SubscriptionsLayer),
  Layer.provideMerge(DatabaseLayer),
);

const ServerRuntimeLayer = Layer.provideMerge(
  DotEnvConfigProvider,
  NodeServices.layer,
);

export const DataRuntime = ManagedRuntime.make(
  Layer.mergeAll(AppLayer, ServerRuntimeLayer),
);
