import { describe, expect, it } from "vitest";

import { serialize } from "../utils.js";

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

  it("uses the fallback when JSON stringification returns undefined", () => {
    expect(serialize(undefined)).toBe("<unserializable>");
  });

  it("uses a custom fallback when provided", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(serialize(circular, "[error]")).toBe("[error]");
    expect(serialize(undefined, "[error]")).toBe("[error]");
  });
});
