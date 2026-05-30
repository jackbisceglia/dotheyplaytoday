import { DatabaseLayer, EventsLayer, SubjectsLayer } from "@dtpt/core-v2";
import { Layer } from "effect";

export const SeedDomainLayers = Layer.mergeAll(SubjectsLayer, EventsLayer);

export const SeedRuntimeLayer = SeedDomainLayers.pipe(
  Layer.provideMerge(DatabaseLayer),
);
