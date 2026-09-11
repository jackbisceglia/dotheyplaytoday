import { makeAuthFixture } from "../auth/__tests__/fixtures.js";
import { RuntimeContext } from "alchemy/RuntimeContext";
import {
  DatabaseReadError,
  DatabaseWriteError,
} from "@dtpt/core/lib/database/errors";
import { CloudflareHttpApiPlatformLayer } from "@dtpt/core/lib/effect/http/cloudflare";
import { Subject } from "@dtpt/core/modules/subjects/schema";
import { Subjects } from "@dtpt/core/modules/subjects/service";
import {
  InvalidSubjectSelection,
  SubjectCapacityReached,
} from "@dtpt/core/modules/subscriptions/errors";
import { SubscriptionWithSubject } from "@dtpt/core/modules/subscriptions/schema";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
import { User } from "@dtpt/core/modules/users/schema";
import {
  UserAlreadyExists,
  UserNotFound,
  Users,
} from "@dtpt/core/modules/users/service";
import { Context, Effect, FileSystem, Layer, Path, Schema } from "effect";
import { HttpRouter } from "effect/unstable/http";
import { Pool } from "pg";
import { describe, expect, it, onTestFinished, vi } from "vitest";

import { mockTransactions } from "./fixtures.js";
import { Auth } from "../auth/auth.js";
import { HttpApiLayer } from "../index.js";
import { RateLimitExceeded } from "../rate-limit/errors.js";
import { RateLimiter } from "../rate-limit/service.js";

const user = Schema.decodeUnknownSync(User)({
  id: "00000000-0000-4000-8000-000000000001",
  email: "user@example.com",
  timezone: "America/New_York",
  unsubscribeToken: "00000000-0000-4000-8000-000000000002",
  name: null,
  emailVerified: false,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
});
const subject = Schema.decodeUnknownSync(Subject)({
  id: "00000000-0000-4000-8000-000000000003",
  _tag: "sports_team",
  details: {
    _tag: "sports_team",
    leagueId: "nba",
    display: "Boston Celtics",
    location: "Boston",
    name: "Celtics",
    abbreviation: "BOS",
  },
});
const subscription = Schema.decodeUnknownSync(SubscriptionWithSubject)({
  id: "00000000-0000-4000-8000-000000000004",
  userId: user.id,
  subjectId: subject.id,
  schedule: { _tag: "fixed_local_time", sendAtSecondsLocal: 32400 },
  lastSentAt: null,
  subject,
});
const signup = {
  email: " USER@Example.COM ",
  timezone: "America/New_York",
  subjectIds: [subject.id],
  schedule: subscription.schedule,
};

const makeFixture = async () => {
  const fixture = await makeAuthFixture();
  await fixture.database.query("UPDATE users SET id = $1", [user.id]);

  const get = vi.fn<Users["Service"]["get"]>(() => Effect.succeed(user));
  const create = vi.fn<Users["Service"]["create"]>(() => Effect.succeed(user));
  const getByToken = vi.fn<Users["Service"]["getByUnsubscribeToken"]>(() =>
    Effect.succeed(user),
  );
  const remove = vi.fn<Users["Service"]["remove"]>(() => Effect.void);
  const list = vi.fn<Subscriptions["Service"]["listForUser"]>(() =>
    Effect.succeed([subscription]),
  );
  const replace = vi.fn<Subscriptions["Service"]["replaceForUser"]>(() =>
    Effect.succeed([subject]),
  );
  const subjects = vi.fn<Subjects["Service"]["list"]>(() =>
    Effect.succeed([subject]),
  );
  const check = vi.fn<RateLimiter["Service"]["check"]>(() => Effect.void);
  const transactions: ("begin" | "commit" | "rollback")[] = [];
  const pool = new Pool();
  vi.spyOn(pool, "connect").mockImplementation(() => {
    throw new Error("Unexpected SQL in handler test");
  });
  onTestFinished(() => pool.end());

  const web = HttpRouter.toWebHandler(
    HttpApiLayer.pipe(
      Layer.provide([
        Layer.succeed(Auth, fixture.auth),
        Layer.mock(Users, {
          get,
          create,
          getByUnsubscribeToken: getByToken,
          remove,
        }),
        Layer.mock(Subscriptions, {
          listForUser: list,
          replaceForUser: replace,
        }),
        Layer.mock(Subjects, { list: subjects }),
        Layer.succeed(RateLimiter, { check }),
        mockTransactions(Effect.succeed(pool), (event) =>
          transactions.push(event),
        ),
        CloudflareHttpApiPlatformLayer,
        FileSystem.layerNoop({}),
        Path.layer,
      ]),
      Layer.provide(fixture.layer),
    ),
  );
  onTestFinished(web.dispose);

  const request = (path: string, body?: unknown, cookie?: string) =>
    web.handler(
      new Request(`https://api.example.com/api${path}`, {
        method: body === undefined ? "GET" : "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://www.example.com",
          ...(cookie ? { cookie } : {}),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      }),
      Context.make(RuntimeContext, {
        Type: "test",
        id: "test",
        env: {},
        get: () => Effect.die("Unexpected binding lookup"),
        set: () => Effect.die("Unexpected binding write"),
      }),
    );
  const signIn = async () => {
    await fixture.auth.client.handler(
      fixture.request("/sign-in/magic-link", { email: user.email }),
    );
    const url = fixture.sendConfirmationLink.mock.calls[0]?.[1];
    if (!url) throw new Error("Missing magic link");
    const response = await fixture.auth.client.handler(new Request(url));
    const cookie = response.headers.get("set-cookie")?.split(";", 1)[0];
    if (!cookie) throw new Error("Missing session cookie");
    return cookie;
  };

  return {
    ...fixture,
    request,
    transactions,
    signIn,
    subjects,
    get,
    create,
    getByToken,
    remove,
    list,
    replace,
    check,
  };
};

const reads = ["/user", "/user/subscription"];

describe("assembled HTTP API", () => {
  it("mounts Better Auth beneath /api/auth", async () => {
    const f = await makeFixture();
    const response = await f.request("/auth/sign-in/magic-link", {
      email: "unknown@example.com",
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: true });
    const session = await f.request("/auth/get-session");
    expect(session.status).toBe(200);
    expect(await session.json()).toBeNull();
  });

  it("maps subject failures and validates and rate limits feedback", async () => {
    const f = await makeFixture();
    f.subjects.mockReturnValue(
      Effect.fail(new DatabaseReadError({ operation: "Subjects.list" })),
    );
    expect((await f.request("/subjects")).status).toBe(500);

    expect(
      (await f.request("/feedback", { type: "general", request: "   " }))
        .status,
    ).toBe(400);
    expect(f.check).not.toHaveBeenCalled();
    f.check.mockReturnValue(
      Effect.fail(new RateLimitExceeded({ key: "test", limit: 1, window: 60 })),
    );
    expect(
      (await f.request("/feedback", { type: "general", request: "Thanks!" }))
        .status,
    ).toBe(429);
  });

  it("rejects signed-out and invalid-cookie reads without caching or querying users", async () => {
    const f = await makeFixture();
    for (const path of reads) {
      for (const cookie of [
        undefined,
        "__Secure-better-auth.session_token=invalid",
      ]) {
        const response = await f.request(
          `${path}?email=${user.email}&userId=${user.id}`,
          undefined,
          cookie,
        );
        expect(response.status).toBe(401);
        expect(response.headers.get("cache-control")).toBe("no-store");
      }
    }
    expect(f.get).not.toHaveBeenCalled();
    expect(f.list).not.toHaveBeenCalled();
  });

  it("uses only the session identity and returns domain projections with credentialed CORS", async () => {
    const f = await makeFixture();
    const cookie = await f.signIn();
    const response = await f.request(
      "/user?email=other@example.com&userId=other",
      undefined,
      cookie,
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      email: user.email,
      timezone: "America/New_York",
      unsubscribeToken: user.unsubscribeToken,
    });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("access-control-allow-origin")).toBe(
      "https://www.example.com",
    );
    expect(response.headers.get("access-control-allow-credentials")).toBe(
      "true",
    );
    const subscriptions = await f.request(
      "/user/subscription?userId=other",
      undefined,
      cookie,
    );
    expect(subscriptions.status).toBe(200);
    expect(subscriptions.headers.get("cache-control")).toBe("no-store");
    expect(await subscriptions.json()).toEqual([
      Schema.encodeSync(SubscriptionWithSubject)(subscription),
    ]);
    expect(f.get.mock.calls).toEqual([[user.id], [user.id]]);
    expect(f.list).toHaveBeenCalledExactlyOnceWith(user.id);

    f.list.mockReturnValue(Effect.succeed([]));
    expect(
      await (await f.request("/user/subscription", undefined, cookie)).json(),
    ).toEqual([]);
    await f.auth.client.api.signOut({ headers: new Headers({ cookie }) });
    for (const path of reads)
      expect((await f.request(path, undefined, cookie)).status).toBe(401);
  });

  it("maps missing users and persistence failures and keeps errors uncached", async () => {
    const f = await makeFixture();
    const cookie = await f.signIn();
    for (const [error, status] of [
      [new UserNotFound({ key: "id", value: user.id }), 401],
      [new DatabaseReadError({ operation: "Users.get" }), 500],
    ] as const) {
      f.get.mockReturnValue(Effect.fail(error));
      for (const path of reads) {
        const response = await f.request(path, undefined, cookie);
        expect(response.status).toBe(status);
        expect(response.headers.get("cache-control")).toBe("no-store");
      }
    }
    expect(f.list).not.toHaveBeenCalled();
    f.get.mockReturnValue(Effect.succeed(user));
    f.list.mockReturnValue(
      Effect.fail(
        new DatabaseReadError({ operation: "Subscriptions.listForUser" }),
      ),
    );
    const response = await f.request("/user/subscription", undefined, cookie);
    expect(response.status).toBe(500);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("fails safely when the session contains an invalid domain ID or lookup rejects", async () => {
    const f = await makeFixture();
    await f.database.query("UPDATE users SET id = 'not-a-uuid'");
    const cookie = await f.signIn();
    for (const path of reads) {
      const response = await f.request(path, undefined, cookie);
      expect(response.status).toBe(500);
      expect(response.headers.get("cache-control")).toBe("no-store");
    }
    vi.spyOn(f.auth.client.api, "getSession").mockRejectedValue(
      new Error("Auth unavailable"),
    );
    for (const path of reads) {
      const response = await f.request(path, undefined, cookie);
      expect(response.status).toBe(500);
      expect(response.headers.get("cache-control")).toBe("no-store");
    }
    expect(f.get).not.toHaveBeenCalled();
  });

  it("creates preferences before issuing one confirmation link", async () => {
    const f = await makeFixture();
    const original = f.auth.client.api.signInMagicLink;
    const issue = vi
      .spyOn(f.auth.client.api, "signInMagicLink")
      .mockImplementation((input) => {
        expect(f.transactions).toEqual(["begin", "commit"]);
        return original(input);
      });
    f.replace.mockImplementation(() =>
      Effect.sync(() => {
        expect(issue).not.toHaveBeenCalled();
        return [subject];
      }),
    );
    const response = await f.request("/user", signup);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(f.create).toHaveBeenCalledExactlyOnceWith(user.email, user.timezone);
    expect(f.replace).toHaveBeenCalledExactlyOnceWith({
      user,
      subjectIds: [subject.id],
      schedule: subscription.schedule,
    });
    expect(issue).toHaveBeenCalledOnce();
    expect(issue.mock.calls[0]?.[0]?.body).toEqual({ email: user.email });
    expect(f.sendConfirmationLink).toHaveBeenCalledOnce();
    expect(f.sendSignInLink).not.toHaveBeenCalled();
    const link = f.sendConfirmationLink.mock.calls[0]?.[1];
    if (!link) throw new Error("Missing confirmation link");
    expect(new URL(link).searchParams.get("callbackURL")).toBe(
      "https://www.example.com/home?confirmation=1",
    );
    expect(new URL(link).searchParams.get("errorCallbackURL")).toBe(
      "https://www.example.com/",
    );
    expect(f.pending).toHaveLength(1);
    await Promise.all(f.pending);
  });

  it.each([false, true])(
    "returns duplicate 409 without writing preferences (verified: %s)",
    async (verified) => {
      const f = await makeFixture();
      await f.database.query("UPDATE users SET email_verified = $1", [
        verified,
      ]);
      f.create.mockReturnValue(Effect.fail(new UserAlreadyExists({})));
      const original = f.auth.client.api.signInMagicLink;
      const issue = vi
        .spyOn(f.auth.client.api, "signInMagicLink")
        .mockImplementation((input) => {
          expect(f.transactions).toEqual(["begin", "rollback"]);
          return original(input);
        });
      const response = await f.request("/user", {
        ...signup,
        timezone: "Europe/London",
        schedule: { ...signup.schedule, sendAtSecondsLocal: 36000 },
      });
      expect(response.status).toBe(409);
      expect(issue).toHaveBeenCalledOnce();
      expect(await response.json()).toEqual({ _tag: "DuplicateSignup" });
      expect(f.replace).not.toHaveBeenCalled();
      expect(f.sendConfirmationLink).toHaveBeenCalledTimes(verified ? 0 : 1);
      expect(f.sendSignInLink).toHaveBeenCalledTimes(verified ? 1 : 0);
      const sender = verified ? f.sendSignInLink : f.sendConfirmationLink;
      const link = sender.mock.calls[0]?.[1];
      if (!link) throw new Error("Missing duplicate signup link");
      expect(new URL(link).searchParams.get("callbackURL")).toBe(
        verified
          ? "https://www.example.com/home"
          : "https://www.example.com/home?confirmation=1",
      );
      expect(new URL(link).searchParams.get("errorCallbackURL")).toBe(
        "https://www.example.com/",
      );
      expect((await f.rows("users"))[0]).toMatchObject({
        timezone: "America/New_York",
        email_verified: verified,
      });
      await Promise.all(f.pending);
    },
  );

  it.each([false, true])(
    "keeps the response and permits a replacement after issuance failure (duplicate: %s)",
    async (duplicate) => {
      const f = await makeFixture();
      if (duplicate)
        f.create.mockReturnValue(Effect.fail(new UserAlreadyExists({})));
      const issue = vi
        .spyOn(f.auth.client.api, "signInMagicLink")
        .mockRejectedValueOnce(new Error("Auth unavailable"));
      expect((await f.request("/user", signup)).status).toBe(
        duplicate ? 409 : 200,
      );
      expect(f.replace).toHaveBeenCalledTimes(duplicate ? 0 : 1);
      expect(f.sendConfirmationLink).not.toHaveBeenCalled();
      f.create.mockReturnValue(Effect.fail(new UserAlreadyExists({})));
      expect((await f.request("/user", signup)).status).toBe(409);
      expect(issue).toHaveBeenCalledTimes(2);
      expect(f.sendConfirmationLink).toHaveBeenCalledOnce();
      expect(f.replace).toHaveBeenCalledTimes(duplicate ? 0 : 1);
      await Promise.all(f.pending);
    },
  );

  it("keeps unsubscribe token-based and idempotent", async () => {
    const f = await makeFixture();
    const response = await f.request("/user/unsubscribe", {
      token: user.unsubscribeToken,
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(f.getByToken).toHaveBeenCalledExactlyOnceWith(user.unsubscribeToken);
    expect(f.remove).toHaveBeenCalledExactlyOnceWith(user.id);
    f.getByToken.mockReturnValue(
      Effect.fail(
        new UserNotFound({
          key: "unsubscribeToken",
          value: user.unsubscribeToken,
        }),
      ),
    );
    const repeated = await f.request("/user/unsubscribe", {
      token: user.unsubscribeToken,
    });
    expect(repeated.status).toBe(200);
    expect(await repeated.json()).toEqual({ ok: true });
    expect(f.remove).toHaveBeenCalledOnce();
  });

  it("registers confirmation delivery in the background after successful persistence", async () => {
    const f = await makeFixture();
    const delivery = Promise.withResolvers<undefined>();
    f.sendConfirmationLink.mockImplementationOnce(() =>
      Effect.promise(() => delivery.promise),
    );

    try {
      expect((await f.request("/user", signup)).status).toBe(200);
      expect(f.pending).toHaveLength(1);
      expect(f.replace).toHaveBeenCalledOnce();
    } finally {
      delivery.resolve(undefined);
      await Promise.all(f.pending);
    }

    f.sendConfirmationLink.mockClear();
    f.replace.mockReturnValue(
      Effect.fail(
        new DatabaseReadError({ operation: "Subscriptions.replaceForUser" }),
      ),
    );
    expect((await f.request("/user", signup)).status).toBe(500);
    expect(f.sendConfirmationLink).not.toHaveBeenCalled();
    expect(f.pending).toHaveLength(1);
  });

  it("does not issue links when creation or subscription validation fails", async () => {
    const f = await makeFixture();
    const issue = vi.spyOn(f.auth.client.api, "signInMagicLink");
    f.create.mockReturnValueOnce(
      Effect.fail(new DatabaseWriteError({ operation: "Users.create" })),
    );
    expect((await f.request("/user", signup)).status).toBe(500);
    expect(f.replace).not.toHaveBeenCalled();

    for (const error of [
      new InvalidSubjectSelection({ invalidIds: [subject.id] }),
      new SubjectCapacityReached({ limit: 4, received: 5 }),
    ]) {
      f.replace.mockReturnValueOnce(Effect.fail(error));
      expect((await f.request("/user", signup)).status).toBe(400);
    }
    expect(issue).not.toHaveBeenCalled();
    expect(f.transactions).toEqual([
      "begin",
      "rollback",
      "begin",
      "rollback",
      "begin",
      "rollback",
    ]);
    expect(f.pending).toHaveLength(0);
  });

  it("rejects malformed registration and unsubscribe payloads before persistence", async () => {
    const f = await makeFixture();
    for (const payload of [
      { ...signup, email: "invalid" },
      { ...signup, timezone: "invalid" },
      { ...signup, subjectIds: [] },
      {
        ...signup,
        schedule: { ...signup.schedule, sendAtSecondsLocal: 32401 },
      },
    ]) {
      expect((await f.request("/user", payload)).status).toBe(400);
    }
    expect(
      (await f.request("/user/unsubscribe", { token: "invalid" })).status,
    ).toBe(400);
    expect(f.create).not.toHaveBeenCalled();
    expect(f.getByToken).not.toHaveBeenCalled();
  });

  it("rate limits moved writes before persistence", async () => {
    const f = await makeFixture();
    f.check.mockReturnValue(
      Effect.fail(new RateLimitExceeded({ key: "test", limit: 1, window: 60 })),
    );
    expect((await f.request("/user", signup)).status).toBe(429);
    expect(
      (await f.request("/user/unsubscribe", { token: user.unsubscribeToken }))
        .status,
    ).toBe(429);
    expect(f.create).not.toHaveBeenCalled();
    expect(f.getByToken).not.toHaveBeenCalled();
    expect(f.sendConfirmationLink).not.toHaveBeenCalled();
    expect(f.sendSignInLink).not.toHaveBeenCalled();
    expect(await f.rows("auth_verifications")).toHaveLength(0);
  });

  it("removes legacy routes while retaining ping and subjects", async () => {
    const f = await makeFixture();
    expect((await f.request("/signup", signup)).status).toBe(404);
    expect(
      (await f.request("/unsubscribe", { token: user.unsubscribeToken }))
        .status,
    ).toBe(404);
    expect((await f.request("/account")).status).toBe(404);
    expect((await f.request("/ping")).status).toBe(200);
    expect((await f.request("/subjects")).status).toBe(200);
  });
});
