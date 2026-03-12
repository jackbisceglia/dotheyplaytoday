import { BackendRuntime } from "@dtpt/core/lib/config/environment";
import { KvsOverride } from "@dtpt/core/modules/kvs/config";
import {
  type KvsOption as CoreKvsOption,
  getKvsSelection,
  makeKvsLayer,
} from "@dtpt/core/modules/kvs/service";
import { Effect } from "effect";

export type KvsOption = CoreKvsOption;

export const getConfiguredKvs = Effect.fn("jobs.getConfiguredKvs")(function* (
  override?: KvsOption,
) {
  const runtime = yield* BackendRuntime;
  const envOverride = yield* KvsOverride;
  const selectedOverride = override ?? envOverride;
  const selection = getKvsSelection(runtime, selectedOverride);
  const relative = "../../../core/data/kv".split("/");

  return {
    runtime,
    override: selectedOverride,
    selection,
    layer: makeKvsLayer(selection, import.meta.dirname, ...relative),
  };
});
