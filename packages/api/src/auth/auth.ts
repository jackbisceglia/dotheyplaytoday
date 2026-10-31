import * as Cloudflare from "alchemy/Cloudflare";
import { ApiUrl } from "@dtpt/core/lib/config/api";
import { WebUrl } from "@dtpt/core/lib/config/web";
import type { Id } from "@dtpt/core/lib/id/service";
import {
  sendSignInCode,
  sendSignInLink,
} from "@dtpt/core/modules/email/transactional/sign-in";
import {
  sendConfirmationCode,
  sendConfirmationLink,
} from "@dtpt/core/modules/email/transactional/confirmation";
import {
  EmailAddressFromString,
  usersTable,
} from "@dtpt/core/modules/users/schema";
import {
  authAccountsTable,
  authSessionsTable,
  authVerificationsTable,
} from "@dtpt/core/modules/auth/schema";
import { makeExecutionMemo } from "alchemy/Runtime/ExecutionMemo";
import type { RuntimeContext } from "alchemy/RuntimeContext";
import { betterAuth, type DBAdapter } from "better-auth";
import { APIError, createAuthMiddleware, isAPIError } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { emailOTP, magicLink } from "better-auth/plugins";
import {
  Boolean,
  Context,
  Effect,
  Layer,
  Option,
  Redacted,
  Schema,
} from "effect";
import type { Headers } from "effect/unstable/http/Headers";
import { AsyncLocalStorage } from "node:async_hooks";
import { Pool } from "pg";

import { AuthConfig } from "./config.js";

const decodeRecipientContext = Schema.decodeUnknownOption(
  Schema.Struct({
    user: Schema.Struct({
      email: EmailAddressFromString,
      emailVerified: Schema.Boolean,
    }),
  }),
);

const confirmsEmail = Schema.is(
  Schema.Struct({ confirmsEmail: Schema.Literal(true) }),
);

const decodeEmailBody = Schema.decodeUnknownOption(
  Schema.Struct({ email: EmailAddressFromString }),
);

const decodeSignInCodeBody = Schema.decodeUnknownOption(
  Schema.Struct({
    email: EmailAddressFromString,
    type: Schema.Literal("sign-in"),
  }),
);

const createAuthPool = (connectionString: string) =>
  Effect.acquireRelease(
    Effect.sync(() => new Pool({ connectionString, max: 1 })),
    (pool) => Effect.promise(() => pool.end()),
  );

export class AuthRequestError extends Schema.TaggedError<AuthRequestError>()(
  "AuthRequestError",
  { cause: Schema.Defect() },
) {}

type Send = ReturnType<typeof sendSignInCode>;

/** @effect-expect-leaking RuntimeContext | Cloudflare.WorkerExecutionContext */
export class Auth extends Context.Service<Auth>()("@dtpt/api/Auth", {
  make: Effect.fn("Auth.make")(function* (
    connectionString: Effect.Effect<Redacted.Redacted, never, RuntimeContext>,
  ) {
    const config = yield* AuthConfig;
    const apiUrl = new URL(yield* ApiUrl);
    const webUrl = new URL("/", yield* WebUrl);
    const homeUrl = new URL("/home", webUrl);
    // Preserve runtime config and Id when Better Auth calls back into Effect.
    const runPromise = Effect.runPromiseWith(yield* Effect.context<Id>());

    // The client is built once per Worker; `use` binds the invocation's
    // database adapter and email `waitUntil` for the duration of each call.
    const invocation = new AsyncLocalStorage<{
      readonly adapter: DBAdapter;
      readonly send: (send: Send) => void;
    }>();
    const current = () => {
      const store = invocation.getStore();
      if (!store) throw new Error("Auth used outside Auth.use");
      return store;
    };
    const adapter: DBAdapter = {
      id: "drizzle",
      create: (args) => current().adapter.create(args),
      findOne: (args) => current().adapter.findOne(args),
      findMany: (args) => current().adapter.findMany(args),
      count: (args) => current().adapter.count(args),
      update: (args) => current().adapter.update(args),
      updateMany: (args) => current().adapter.updateMany(args),
      delete: (args) => current().adapter.delete(args),
      deleteMany: (args) => current().adapter.deleteMany(args),
      consumeOne: (args) => current().adapter.consumeOne(args),
      incrementOne: (args) => current().adapter.incrementOne(args),
      transaction: (callback) => current().adapter.transaction(callback),
    };

    const client = betterAuth({
      appName: "dotheyplaytoday",
      basePath: "/api/auth",
      baseURL: apiUrl.origin,
      secret: Redacted.value(config.secret),
      trustedOrigins: [apiUrl.origin, webUrl.origin],
      database: () => adapter,
      disabledPaths: [
        "/update-user",
        "/email-otp/check-verification-otp",
        "/email-otp/verify-email",
        "/email-otp/request-password-reset",
        "/email-otp/reset-password",
        "/forget-password/email-otp",
        "/email-otp/request-email-change",
        "/email-otp/change-email",
      ],
      rateLimit: {
        enabled: true,
        window: 60,
        max: 100,
        customRules: {
          "/sign-in/magic-link": { window: 60, max: 5 },
          "/magic-link/verify": { window: 60, max: 10 },
          "/email-otp/send-verification-otp": { window: 60, max: 5 },
          "/sign-in/email-otp": { window: 60, max: 10 },
        },
      },
      advanced: {
        disableOriginCheck: false,
        useSecureCookies: apiUrl.protocol === "https:",
        ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] },
      },
      hooks: {
        before: createAuthMiddleware(async (ctx) => {
          if (ctx.path === "/email-otp/send-verification-otp") {
            const body = decodeSignInCodeBody(ctx.body);

            if (Option.isNone(body)) {
              throw APIError.fromStatus("BAD_REQUEST", {
                message: "Invalid OTP type",
              });
            }

            const email = body.value.email;
            const account =
              await ctx.context.internalAdapter.findUserByEmail(email);
            const user = account?.user;

            if (!user) return ctx.json({ success: true });

            return {
              context: {
                body: { email },
                context: { user },
              },
            };
          }

          if (ctx.path === "/sign-in/email-otp") {
            const body = decodeEmailBody(ctx.body);

            if (Option.isNone(body)) return;

            const account = await ctx.context.internalAdapter.findUserByEmail(
              body.value.email,
            );

            return {
              context: {
                body: { email: body.value.email },
                context: {
                  confirmsEmail: account?.user.emailVerified === false,
                },
              },
            };
          }

          if (ctx.path !== "/sign-in/magic-link") return;

          const body = decodeEmailBody(ctx.body);

          if (Option.isNone(body)) return;

          const account = await ctx.context.internalAdapter.findUserByEmail(
            body.value.email,
          );

          const user = account?.user ?? null;
          const isUserVerified = user?.emailVerified ?? false;

          return {
            context: {
              body: {
                callbackURL: Boolean.match(isUserVerified, {
                  onTrue: () => homeUrl.href,
                  onFalse: () => new URL("?confirmation=1", homeUrl).href,
                }),
                // TODO: surface the failed-link message as a toast, mirroring the confirmation marker.
                errorCallbackURL: webUrl.href,
              },
              context: { user },
            },
          };
        }),
        after: createAuthMiddleware(async (ctx) => {
          if (ctx.path !== "/sign-in/email-otp") return;

          const returned = ctx.context.returned;

          if (!confirmsEmail(ctx.context) || isAPIError(returned)) return;
          if (typeof returned !== "object" || returned === null) return;

          return ctx.json({ ...returned, confirmation: true });
        }),
      },
      plugins: [
        magicLink({
          disableSignUp: true,
          expiresIn: 15 * 60,
          storeToken: "hashed",
          sendMagicLink: (options, endpoint) => {
            if (!endpoint) return;

            const recipient = decodeRecipientContext(endpoint.context);

            if (Option.isNone(recipient)) return;

            const { email, emailVerified } = recipient.value.user;
            const send = emailVerified
              ? sendSignInLink(email, options.url)
              : sendConfirmationLink(email, options.url);

            current().send(send);
          },
        }),
        emailOTP({
          disableSignUp: true,
          expiresIn: 10 * 60,
          storeOTP: "hashed",
          allowedAttempts: 3,
          sendVerificationOTP: ({ otp }, endpoint) => {
            const recipient = decodeRecipientContext(endpoint?.context);

            if (Option.isSome(recipient)) {
              const { email, emailVerified } = recipient.value.user;
              const send = emailVerified
                ? sendSignInCode(email, otp)
                : sendConfirmationCode(email, otp);

              current().send(send);
            }

            return Promise.resolve();
          },
        }),
      ],
    });

    const resources = yield* makeExecutionMemo(
      Effect.gen(function* () {
        const url = yield* connectionString;
        const pool = yield* createAuthPool(Redacted.value(url));
        const cloudflare = yield* Cloudflare.WorkerExecutionContext;
        return {
          adapter: drizzleAdapter(drizzle({ client: pool }), {
            provider: "pg",
            transaction: true,
            schema: {
              user: usersTable,
              session: authSessionsTable,
              account: authAccountsTable,
              verification: authVerificationsTable,
            },
          })(client.options),
          send: (send: Send) => {
            cloudflare.raw.waitUntil(runPromise(send.pipe(Effect.ignore)));
          },
        };
      }),
    );

    const use = <A>(f: (auth: typeof client) => PromiseLike<A>) =>
      Effect.flatMap(resources, (resources) =>
        Effect.tryPromise({
          try: () => invocation.run(resources, () => f(client)),
          catch: (cause) => new AuthRequestError({ cause }),
        }),
      );

    const getSession = Effect.fn("Auth.getSession")((headers: Headers) =>
      use((client) => client.api.getSession({ headers })),
    );

    return { use, client, getSession };
  }),
}) {}

export const createAuthLayerFromHyperdriveResource = (
  client: Cloudflare.Hyperdrive.ConnectClient,
) => Layer.effect(Auth, Auth.make(client.connectionString));
