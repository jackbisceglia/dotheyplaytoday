/**
 * Naively serializes a value for diagnostics and falls back when JSON stringification fails.
 *
 * This is intended for logs and debug strings, not serious over-the-wire data transfer.
 */
export const serialize = (
  value: unknown,
  fallback?: string,
): string => {
  const fallbackValue = fallback ?? "<unserializable>";

  try {
    const serialized = JSON.stringify(value) as string | undefined;

    return serialized ?? fallbackValue;
  } catch {
    return fallbackValue;
  }
};
