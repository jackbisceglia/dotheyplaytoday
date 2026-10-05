import { Effect, SchemaIssue } from "effect";

export const whenSchemaIssue =
  <A, E, R>(callback: (issue: SchemaIssue.Issue) => Effect.Effect<A, E, R>) =>
  (error: unknown) =>
    SchemaIssue.isIssue(error) ? callback(error) : Effect.void;
