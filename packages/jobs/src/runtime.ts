import { createD1DatabaseLayer } from "@dtpt/core/lib/database/d1";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { IdLayer } from "@dtpt/core/lib/id/service";
import { EmailChannelLayer } from "@dtpt/core/modules/channels/email/service";
import { EventsLayer } from "@dtpt/core/modules/events/service";
import { SubscriptionsLayer } from "@dtpt/core/modules/subscriptions/service";
import { Layer, ManagedRuntime } from "effect";

export type JobsDatabaseBinding = Parameters<typeof createD1DatabaseLayer>[0];

export type JobsLayerOptions = {
  readonly database: JobsDatabaseBinding;
};

export const createJobsLayer = (options: JobsLayerOptions) =>
  Layer.mergeAll(SubscriptionsLayer, EventsLayer, EmailChannelLayer).pipe(
    Layer.provide(IdLayer),
    Layer.provideMerge(CloudflareCryptoLayer),
    Layer.provideMerge(createD1DatabaseLayer(options.database)),
  );

export const createJobsRuntime = (options: JobsLayerOptions) =>
  ManagedRuntime.make(createJobsLayer(options));
