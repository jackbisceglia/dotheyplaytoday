import { describe, expect, it } from "vitest";

import { AuthGroup } from "../auth.js";

describe("auth contract", () => {
  it("routes Better Auth GET and POST requests through the API", () => {
    expect(AuthGroup.endpoints.get.method).toBe("GET");
    expect(AuthGroup.endpoints.get.path).toBe("/auth/*");
    expect(AuthGroup.endpoints.post.method).toBe("POST");
    expect(AuthGroup.endpoints.post.path).toBe("/auth/*");
  });
});
