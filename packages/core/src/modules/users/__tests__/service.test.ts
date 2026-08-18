import { describe, expect, it } from "vitest";
import { Schema } from "effect";

import { User, UserId } from "../schema.js";
import { classifySignupUser } from "../service.js";

const user = Schema.decodeUnknownSync(User)({
  id: "00000000-0000-4000-8000-000000000101",
  email: "fan@example.com",
  timezone: "America/New_York",
  unsubscribeToken: "00000000-0000-4000-8000-000000000201",
});

describe("signup user classification", () => {
  it("classifies the returned candidate ID as a first signup", () => {
    const outcome = classifySignupUser(user.id, user);

    expect(outcome).toEqual({
      _tag: "first_signup",
      user,
    });
  });

  it("classifies an existing returned ID as a repeat signup", () => {
    const outcome = classifySignupUser(
      UserId.make("00000000-0000-4000-8000-000000000999"),
      user,
    );

    expect(outcome).toEqual({
      _tag: "repeat_signup",
      user,
    });
  });
});
