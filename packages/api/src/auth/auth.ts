import * as Cloudflare from "alchemy/Cloudflare";
import { ApiUrl } from "@dtpt/core/lib/config/api";
import { WebUrl } from "@dtpt/core/lib/config/web";
import { Id } from "@dtpt/core/lib/id/service";
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
import {
  betterAuth,
  type BetterAuthOptions,
  type DBAdapter,
} from "better-auth";
import { AsyncLocalStorage } from "node:async_hooks";
import type { RuntimeContext } from "alchemy/RuntimeContext";
import { makeExecutionMemo } from "alchemy/Runtime/ExecutionMemo";
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

const createAdapter = (pool: Pool) =>
  drizzleAdapter(drizzle({ client: pool }), {
    provider: "pg",
    transaction: true,
    schema: {
      user: usersTable,
      session: authSessionsTable,
      account: authAccountsTable,
      verification: authVerificationsTable,
    },
  });

type SendEmail = (send: ReturnType<typeof sendSignInCode>) => void;

const createClient = (
  secret: Redacted.Redacted,
  apiUrl: URL,
  webUrl: URL,
  database: (options: BetterAuthOptions) => DBAdapter,
  sendEmail: SendEmail,
) => {
  const homeUrl = new URL("/home", webUrl);
  return betterAuth({
    appName: "dotheyplaytoday",
    basePath: "/api/auth",
    baseURL: apiUrl.origin,
    secret: Redacted.value(secret),
    trustedOrigins: [apiUrl.origin, webUrl.origin],
    database,
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

          sendEmail(send);
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

            sendEmail(send);
          }

          return Promise.resolve();
        },
      }),
    ],
  });
};

type Client = ReturnType<typeof createClient>;

/** @effect-expect-leaking RuntimeContext | Cloudflare.WorkerExecutionContext */
export class Auth extends Context.Service<
  Auth,
  {
    readonly use: <A>(
      f: (auth: Client) => PromiseLike<A>,
    ) => Effect.Effect<
      A,
      AuthRequestError,
      RuntimeContext | Cloudflare.WorkerExecutionContext
    >;
    readonly getSession: (
      headers: Headers,
    ) => Effect.Effect<
      Awaited<ReturnType<Client["api"]["getSession"]>>,
      AuthRequestError,
      RuntimeContext | Cloudflare.WorkerExecutionContext
    >;
  }
>()("@dtpt/api/Auth") {}

/** Builds reusable endpoints; only `use` enters the current request's resources. */
export const makeReusableAuth = Effect.fn("Auth.makeReusable")(function* (
  connectionString: Effect.Effect<string, never, RuntimeContext>,
) {
  const config = yield* AuthConfig;
  const apiUrl = new URL(yield* ApiUrl);
  const webUrl = new URL("/", yield* WebUrl);
  const id = yield* Id;
  const current = new AsyncLocalStorage<{
    readonly adapter: DBAdapter;
    readonly sendEmail: SendEmail;
  }>();
  const request = () => {
    const value = current.getStore();
    if (!value) throw new Error("Auth operation outside request scope");
    return value;
  };
  const adapter: DBAdapter = {
    id: "drizzle",
    create: (args) => request().adapter.create(args),
    findOne: (args) => request().adapter.findOne(args),
    findMany: (args) => request().adapter.findMany(args),
    count: (args) => request().adapter.count(args),
    update: (args) => request().adapter.update(args),
    updateMany: (args) => request().adapter.updateMany(args),
    delete: (args) => request().adapter.delete(args),
    deleteMany: (args) => request().adapter.deleteMany(args),
    consumeOne: (args) => request().adapter.consumeOne(args),
    incrementOne: (args) => request().adapter.incrementOne(args),
    transaction: (callback) => request().adapter.transaction(callback),
  };
  const client = createClient(
    config.secret,
    apiUrl,
    webUrl,
    () => adapter,
    (send) => {
      request().sendEmail(send);
    },
  );
  yield* Effect.promise(() => client.$context);

  const resources = yield* makeExecutionMemo(
    Effect.gen(function* () {
      const pool = yield* createAuthPool(yield* connectionString);
      const cloudflare = yield* Cloudflare.WorkerExecutionContext;
      const runPromise = Effect.runPromiseWith(
        yield* Effect.context<Id>().pipe(Effect.provideService(Id, id)),
      );
      return {
        adapter: createAdapter(pool)(client.options),
        sendEmail: (send: ReturnType<typeof sendSignInCode>) => {
          cloudflare.raw.waitUntil(runPromise(send.pipe(Effect.ignore)));
        },
      };
    }),
  );

  const use: Auth["Service"]["use"] = (f) =>
    Effect.gen(function* () {
      const runtime = yield* resources;
      return yield* Effect.tryPromise({
        try: () => current.run(runtime, () => f(client)),
        catch: (cause) => new AuthRequestError({ cause }),
      });
    }).pipe(Effect.uninterruptible);
  return Auth.of({
    use,
    getSession: Effect.fn("Auth.getSession")((headers: Headers) =>
      use((auth) => auth.api.getSession({ headers })),
    ),
  });
});

export const createAuthLayerFromHyperdriveResource = (
  client: Cloudflare.Hyperdrive.ConnectClient,
) =>
  Layer.effect(
    Auth,
    makeReusableAuth(client.connectionString.pipe(Effect.map(Redacted.value))),
  );
