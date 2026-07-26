import * as NodeServices from "@effect/platform-node/NodeServices";
import { createConfigProviderFromDotEnv } from "@dtpt/core/lib/config/providers/dotenv";
import { Layer, ManagedRuntime, pipe } from "effect";
import { FetchHttpClient } from "effect/unstable/http";

export const DotEnvConfigProvider = createConfigProviderFromDotEnv();

export const JobsCliRuntime = ManagedRuntime.make(
  pipe(
    FetchHttpClient.layer,
    Layer.provideMerge(DotEnvConfigProvider),
    Layer.provideMerge(NodeServices.layer),
  ),
);
