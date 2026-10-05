import { Effect, SchemaIssue } from "effect";

export const logSchemaIssue = (message: string) => (error: unknown) =>
  SchemaIssue.isIssue(error)
    ? Effect.logError(message, { error })
    : Effect.void;
