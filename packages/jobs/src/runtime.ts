import * as NodeServices from "@effect/platform-node/NodeServices";
import { EventsLayer, IdLayer, SubscriptionsLayer } from "@dtpt/core";
import {
  createConfigProviderFromCloudflareEnv,
  createConfigProviderFromDotEnv,
} from "@dtpt/core/lib/config/providers";
import { createD1DatabaseLayer } from "@dtpt/core/lib/database/d1";
import { DatabaseLayer } from "@dtpt/core/lib/database/node";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { Layer, ManagedRuntime, pipe } from "effect";
import { FetchHttpClient } from "effect/unstable/http";

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

export const JobsCliRuntime = ManagedRuntime.make(
  pipe(
    FetchHttpClient.layer,
    Layer.provideMerge(DotEnvConfigProvider),
    Layer.provideMerge(NodeServices.layer),
  ),
);

export function makeJobsWorkerRuntime(env: { readonly Database: D1Database }) {
  const JobWorkerLayer = pipe(
    Layer.mergeAll(SubscriptionsLayer, EventsLayer),
    Layer.provide(IdLayer),
    Layer.provideMerge(CloudflareCryptoLayer),
  );
  const DatabaseLayer = createD1DatabaseLayer(env.Database);
  const ConfigProviderLayer = createConfigProviderFromCloudflareEnv(env);

  return ManagedRuntime.make(
    pipe(
      JobWorkerLayer,
      Layer.provideMerge(DatabaseLayer),
      Layer.provideMerge(ConfigProviderLayer),
    ),
  );
}
