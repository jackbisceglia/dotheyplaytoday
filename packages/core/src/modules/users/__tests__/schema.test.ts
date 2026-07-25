import { describe, expect, it } from "@effect/vitest";
import { Schema } from "effect";

import { EmailAddressFromString, User, UserInsert } from "../schema.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;

const userInput = {
  id: "00000000-0000-4000-8000-000000000101",
  email: "test@example.com",
  timezone: "America/New_York",
  unsubscribeToken: "00000000-0000-4000-8000-000000000201",
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
});
