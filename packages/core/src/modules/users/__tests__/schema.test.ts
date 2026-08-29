import { describe, expect, it } from "@effect/vitest";
import { Schema } from "effect";

import { EmailAddressFromString, User, UserInsert } from "../schema.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;

const userInput = {
  id: "00000000-0000-4000-8000-000000000101",
  name: "Test User",
  email: "test@example.com",
  emailVerified: false,
  timezone: "America/New_York",
  unsubscribeToken: "00000000-0000-4000-8000-000000000201",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

describe("User model", () => {
  it("rejects malformed user-owned fields", () => {
    expect(() => decode(User)({ ...userInput, email: "not-email" })).toThrow();
    expect(() =>
      decode(User)({ ...userInput, unsubscribeToken: "short" }),
    ).toThrow();
  });

  it("normalizes email input", () => {
    expect(decode(EmailAddressFromString)(" Test@Example.COM ")).toBe(
      "test@example.com",
    );
  });

  it("encodes and decodes the user row boundary", () => {
    const user = decode(User)(userInput);
    const insert = encode(UserInsert)(user);
    const selected = decode(User)(insert);

    expect(insert).toEqual(userInput);
    expect(selected.email).toBe(user.email);
    expect(selected.unsubscribeToken).toBe(user.unsubscribeToken);
  });

  it("leaves database-managed fields optional on insert", () => {
    const insert = decode(UserInsert)({
      id: userInput.id,
      email: userInput.email,
      timezone: userInput.timezone,
      unsubscribeToken: userInput.unsubscribeToken,
    });

    expect(encode(UserInsert)(insert)).toEqual({
      id: userInput.id,
      email: userInput.email,
      timezone: userInput.timezone,
      unsubscribeToken: userInput.unsubscribeToken,
    });
  });
});
