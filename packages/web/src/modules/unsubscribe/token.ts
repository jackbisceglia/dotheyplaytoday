import { UnsubscribeToken } from "@dtpt/core/modules/users/schema";
import { Schema } from "effect";
import type { Result } from "effect";

export const decodeUnsubscribeToken =
  Schema.decodeUnknownResult(UnsubscribeToken);

export type UnsubscribeTokenResult = ReturnType<
  typeof decodeUnsubscribeToken
>;

export type UnsubscribeTokenFailure =
  Result.Result.Failure<UnsubscribeTokenResult>;

export type UnsubscribeTokenSuccess =
  Result.Result.Success<UnsubscribeTokenResult>;
