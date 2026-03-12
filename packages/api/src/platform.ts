import { NodeContext } from "@effect/platform-node";
import { BackendRuntime } from "@dtpt/core/lib/config/environment";
import { createConfigProviderFromDotEnv } from "@dtpt/core/lib/effect/config";
import { DatabaseNew } from "@dtpt/core/modules/database-new/service";
import { KvsOverride } from "@dtpt/core/modules/kvs/config";
import { getKvsSelection, makeKvsLayer } from "@dtpt/core/modules/kvs/service";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
import { Users } from "@dtpt/core/modules/users/service";
import { Effect, Layer, ManagedRuntime } from "effect";

import { SignupWriteRateLimiter } from "./rate-limiter.js";

export const DotEnvConfigProvider =
  createConfigProviderFromDotEnv("../../.env");

export const KvsSelection = Effect.gen(function* () {
  const runtime = yield* BackendRuntime;
  const override = yield* KvsOverride;

  return getKvsSelection(runtime, override);
});

const KvsLayer = Layer.unwrapEffect(
  Effect.gen(function* () {
    const selection = yield* KvsSelection;
    const relative = "../../core/data/kv".split("/");

    return makeKvsLayer(selection, import.meta.dirname, ...relative);
  }),
);

const ApiServicesLayer = Layer.mergeAll(
  DatabaseNew.Default,
  Users.Default,
  Subscriptions.Default,
  SignupWriteRateLimiter.Default,
).pipe(Layer.provideMerge(KvsLayer));

export const ApiRuntime = ManagedRuntime.make(
  ApiServicesLayer.pipe(
    Layer.provideMerge(DotEnvConfigProvider),
    Layer.provideMerge(NodeContext.layer),
  ),
);
