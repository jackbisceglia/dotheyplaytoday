export const unwrapAlchemyRedactedValue = (value: string) => {
  try {
    const parsed = JSON.parse(value) as unknown;

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "_tag" in parsed &&
      parsed._tag === "Redacted" &&
      "value" in parsed &&
      typeof parsed.value === "string"
    ) {
      return parsed.value;
    }
  } catch {
    // Plain config values are not JSON.
  }

  return value;
};
