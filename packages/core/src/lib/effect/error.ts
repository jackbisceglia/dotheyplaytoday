import { Cause, Data } from "effect";

/**
 * Creates a tagged error class with a specific name and error structure.
 * @template T - The string literal type for the error name
 * @param name - The name of the error class
 * @returns A class that extends Data.TaggedError with the specified name
 */
export function TaggedError<T extends string>(name: T) {
  type E = {
    message: string;
    cause?: unknown;
  };

  const NewClass = class extends Data.TaggedError(name)<E> {
    constructor(message: string, cause?: unknown) {
      super({ message, cause });
    }
  };

  return NewClass as unknown as new <
    A extends Record<string, unknown> = Record<string, unknown>,
  >(
    message: string,
    cause?: unknown,
  ) => Cause.YieldableError & { readonly _tag: T } & Readonly<A>;
}

// this helps if we need to type narrow on a _tagged error if we're forced to throw in a third party lib (eg. in a react component)
export function isTaggedError(
  error: unknown,
): error is { _tag: string; message: string; cause?: unknown } {
  return (
    typeof error === "object" &&
    error !== null &&
    "_tag" in error &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    typeof (error as any)._tag === "string"
  );
}

export type UIErrorTag = "UnknownUIError" | (string & {});

/**
 * Ensures an error is a tagged error. If the input is already a tagged error,
 * it is returned as-is with proper type narrowing. Otherwise, it is wrapped
 * in a GenericTaggedError with the original error passed as the cause.
 *
 * This enables uniform error handling using tag-based switches instead of
 * instanceof checks. Unknown errors (e.g., from third-party libraries) are
 * automatically encoded as GenericTaggedError, allowing consistent handling.
 *
 * @param error - The error to normalize to a tagged error
 * @returns A tagged error (either the original if already tagged, or wrapped in GenericTaggedError)
 *
 * @example
 * ```typescript
 * try {
 *   await someOperation();
 * } catch (error) {
 *   const taggedError = ensureTaggedError(error);
 *   switch (taggedError._tag) {
 *     case "SpecificError":
 *       // handle your custom tagged error
 *       break;
 *     case "GenericTaggedError":
 *       // handle unknown/untagged errors (e.g., from third-party libs)
 *       break;
 *   }
 * }
 * ```
 */
export function ensureTaggedError(error: unknown): {
  _tag: UIErrorTag;
  message: string;
  cause?: unknown;
} {
  class GenericTaggedError extends TaggedError("GenericTaggedError") {}

  if (isTaggedError(error)) {
    return error;
  }

  return new GenericTaggedError(
    error instanceof Error ? error.message : String(error),
    error,
  );
}
