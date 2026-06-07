import {
  DatabaseLayer,
  EventsLayer,
  SubscriptionsLayer,
} from "@dtpt/core-v2";
import { Layer } from "effect";

export const NotifyDomainLayers = Layer.mergeAll(
  SubscriptionsLayer,
  EventsLayer,
);

export const NotifyRuntimeLayer = NotifyDomainLayers.pipe(
  Layer.provideMerge(DatabaseLayer),
);
