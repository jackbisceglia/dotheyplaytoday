import { describe, expect, it } from "vitest";
import { Schema } from "effect";

import { User, UserId } from "../schema.js";
import { wasCreatedForSignup } from "../service.js";

const user = Schema.decodeUnknownSync(User)({
  id: "00000000-0000-4000-8000-000000000101",
  email: "fan@example.com",
  timezone: "America/New_York",
  unsubscribeToken: "00000000-0000-4000-8000-000000000201",
});

describe("wasCreatedForSignup", () => {
  it("recognizes the returned candidate ID as newly created", () => {
    expect(wasCreatedForSignup(user.id, user)).toBe(true);
  });

  it("recognizes a different returned ID as pre-existing", () => {
    expect(
      wasCreatedForSignup(
        UserId.make("00000000-0000-4000-8000-000000000999"),
        user,
      ),
    ).toBe(false);
  });
});
