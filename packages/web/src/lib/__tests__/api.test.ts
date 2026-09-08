import { DateTime } from "effect";
import { expect, it, vi } from "vitest";
import { SubjectId } from "@dtpt/core/modules/subjects/schema";
import { FixedSchedule } from "@dtpt/core/modules/subscriptions/schema";
import {
  EmailAddress,
  UnsubscribeToken,
} from "@dtpt/core/modules/users/schema";

it("sends the typed user operations to their new URLs with browser credentials", async () => {
  vi.stubEnv("SSR", false);
  vi.stubEnv("VITE_API_URL_BASE", "https://api.example.com");
  vi.stubEnv("VITE_API_URL_PORT", undefined);
  const fetch = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValueOnce(
      Response.json({
        email: "user@example.com",
        timezone: "America/New_York",
      }),
    )
    .mockResolvedValueOnce(Response.json([]))
    .mockResolvedValueOnce(Response.json({ ok: true }))
    .mockResolvedValueOnce(Response.json({ ok: true }));
  vi.stubGlobal("fetch", fetch);

  const { withApiClient } = await import("../api.js");
  const { RuntimeClient } = await import("../platform.js");
  try {
    const user = await withApiClient((client) => client.user.get());
    expect(user.email).toBe("user@example.com");
    expect(DateTime.zoneToString(user.timezone)).toBe("America/New_York");
    expect(await withApiClient((client) => client.subscription.list())).toEqual(
      [],
    );
    const create = () =>
      withApiClient((client) =>
        client.user.create({
          payload: {
            email: EmailAddress.make("user@example.com"),
            timezone: DateTime.zoneMakeNamedUnsafe("America/New_York"),
            subjectIds: [
              SubjectId.make("00000000-0000-4000-8000-000000000003"),
            ],
            schedule: FixedSchedule.make({
              _tag: "fixed_local_time",
              sendAtSecondsLocal: 32400,
            }),
          },
        }),
      );
    await create();
    await withApiClient((client) =>
      client.user.unsubscribe({
        payload: {
          token: UnsubscribeToken.make("00000000-0000-4000-8000-000000000002"),
        },
      }),
    );
    expect(
      fetch.mock.calls.map((call) => [
        call[0] instanceof Request ? call[0].url : String(call[0]),
        call[1]?.method,
        call[1]?.credentials,
      ]),
    ).toEqual([
      ["https://api.example.com/api/user", "GET", "include"],
      ["https://api.example.com/api/user/subscription", "GET", "include"],
      ["https://api.example.com/api/user", "POST", "include"],
      ["https://api.example.com/api/user/unsubscribe", "POST", "include"],
    ]);
    fetch.mockResolvedValueOnce(
      Response.json({ _tag: "DuplicateSignup" }, { status: 409 }),
    );
    await expect(create()).rejects.toMatchObject({ _tag: "DuplicateSignup" });
  } finally {
    await RuntimeClient.dispose();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  }
});
