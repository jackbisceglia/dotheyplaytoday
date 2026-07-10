import * as NodeServices from "@effect/platform-node/NodeServices";
import {
  IdLayer,
  SubjectsLayer,
  SubscriptionsLayer,
  UsersLayer,
} from "@dtpt/core";
import { createConfigProviderFromDotEnv } from "@dtpt/core/lib/config/providers";
import { DatabaseLayer } from "@dtpt/core/lib/database/clients/node/layer";
import { Layer, ManagedRuntime, pipe } from "effect";

import { RateLimiterLayer } from "./rate-limit/service.js";

export const DotEnvConfigProvider = createConfigProviderFromDotEnv();

export const ApiRuntime = ManagedRuntime.make(
  pipe(
    Layer.mergeAll(
      SubjectsLayer,
      SubscriptionsLayer,
      UsersLayer,
      RateLimiterLayer,
    ),
    Layer.provideMerge(DatabaseLayer),
    Layer.provide(IdLayer),
    Layer.provideMerge(DotEnvConfigProvider),
    Layer.provideMerge(NodeServices.layer),
  ),
);
