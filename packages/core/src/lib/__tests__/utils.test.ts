import { describe, expect, it } from "vitest";

import { exactOptional, serialize } from "../utils.js";

describe("serialize", () => {
  it("stringifies JSON values", () => {
    expect(serialize({ operation: "notify.markSent" })).toBe(
      '{"operation":"notify.markSent"}',
    );
  });

  it("uses the fallback when JSON stringification fails", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(serialize(circular)).toBe("<unserializable>");
  });

  it.each([undefined, () => "ignored", Symbol("ignored")])(
    "uses the fallback when JSON stringification returns undefined for %s",
    (value) => {
      expect(serialize(value)).toBe("<unserializable>");
    },
  );

  it("uses a custom fallback when provided", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(serialize(circular, "[error]")).toBe("[error]");
    expect(serialize(undefined, "[error]")).toBe("[error]");
  });
});

describe("exactOptional", () => {
  it.each([null, false, 0, ""])("preserves the defined value %s", (value) => {
    expect(exactOptional(value, (value) => ({ key: value }))).toStrictEqual({
      key: value,
    });
  });

  it("constructs an object only for a defined value", () => {
    expect(exactOptional("value", (value) => ({ key: value }))).toEqual({
      key: "value",
    });
    const omitted = exactOptional(undefined, (value) => ({ key: value }));
    expect(Object.hasOwn(omitted, "key")).toBe(false);
  });
});
