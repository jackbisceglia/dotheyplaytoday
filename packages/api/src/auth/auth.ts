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
  EmailAddress,
  EmailAddressFromString,
  usersTable,
} from "@dtpt/core/modules/users/schema";
import {
  authAccountsTable,
  authSessionsTable,
  authVerificationsTable,
} from "@dtpt/core/modules/auth/schema";
import { betterAuth } from "better-auth";
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
import { type User as BetterAuthUser } from "better-auth";
import { Pool } from "pg";

import { AuthConfig } from "./config.js";

type MagicLinkContext = { readonly user: BetterAuthUser | null };
type SignInCodeContext = { readonly user: BetterAuthUser };
type SignInCodeRedemptionContext = { readonly confirmsEmail: boolean };

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

export class Auth extends Context.Service<Auth>()("@dtpt/api/Auth", {
  make: Effect.fn("Auth.make")(function* (connectionString: string) {
    const config = yield* AuthConfig;
    const apiUrl = new URL(yield* ApiUrl);
    const webUrl = new URL("/", yield* WebUrl);
    const homeUrl = new URL("/home", webUrl);
    const pool = yield* createAuthPool(connectionString);
    const cloudflare = yield* Cloudflare.WorkerExecutionContext;
    // Preserve runtime config and Id when Better Auth calls back into Effect.
    const runPromise = Effect.runPromiseWith(yield* Effect.context<Id>());

    const client = betterAuth({
      appName: "dotheyplaytoday",
      basePath: "/api/auth",
      baseURL: apiUrl.origin,
      secret: Redacted.value(config.secret),
      trustedOrigins: [apiUrl.origin, webUrl.origin],
      database: drizzleAdapter(drizzle({ client: pool }), {
        provider: "pg",
        transaction: true,
        schema: {
          user: usersTable,
          session: authSessionsTable,
          account: authAccountsTable,
          verification: authVerificationsTable,
        },
      }),
      // Profile editing belongs to the deferred account experience. In particular,
      // the shared users table intentionally has no Better Auth image column.
      disabledPaths: [
        "/update-user",
        // Sign-in codes are the only OTP flow; redemption also confirms.
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

            // Unknown addresses get the same response, with no stored code.
            if (!user) return ctx.json({ success: true });

            return {
              context: {
                body: { email },
                context: { user } satisfies SignInCodeContext,
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
                } satisfies SignInCodeRedemptionContext,
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
              context: { user } satisfies MagicLinkContext,
            },
          };
        }),
        // Report confirmation only after a code proves mailbox ownership, so
        // Web can show the same confirmation as a redeemed link.
        after: createAuthMiddleware(async (ctx) => {
          if (ctx.path !== "/sign-in/email-otp") return;

          // lint(anti-slop/require-safety-comment-for-type-assertion): The redemption before hook sets confirmsEmail from the stored user; no request body fields enter this context.
          const context = ctx.context as Partial<SignInCodeRedemptionContext>;
          const returned = ctx.context.returned;

          if (!context.confirmsEmail || isAPIError(returned)) return;
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

            // lint(anti-slop/require-safety-comment-for-type-assertion): The before hook above attaches this context; other callers may omit user.
            const context = endpoint.context as Partial<MagicLinkContext>;
            const user = context.user;

            if (!user) return;

            const email = EmailAddress.make(user.email);

            const send = user.emailVerified
              ? sendSignInLink(email, options.url)
              : sendConfirmationLink(email, options.url);

            cloudflare.raw.waitUntil(runPromise(send.pipe(Effect.ignore)));
          },
        }),
        emailOTP({
          disableSignUp: true,
          expiresIn: 10 * 60,
          storeOTP: "hashed",
          allowedAttempts: 3,
          sendVerificationOTP: ({ otp }, endpoint) => {
            // lint(anti-slop/require-safety-comment-for-type-assertion): The issuance before hook attaches the stored user; server callers may omit the endpoint context.
            const context = endpoint?.context as
              | Partial<SignInCodeContext>
              | undefined;
            const user = context?.user;

            if (user) {
              const email = EmailAddress.make(user.email);

              const send = user.emailVerified
                ? sendSignInCode(email, otp)
                : sendConfirmationCode(email, otp);

              cloudflare.raw.waitUntil(runPromise(send.pipe(Effect.ignore)));
            }

            return Promise.resolve();
          },
        }),
      ],
    });

    const use = <A>(f: (auth: typeof client) => PromiseLike<A>) =>
      Effect.tryPromise({
        try: () => f(client),
        catch: (cause) => new AuthRequestError({ cause }),
      });

    const getSession = Effect.fn("Auth.getSession")((headers: Headers) =>
      use((client) => client.api.getSession({ headers })),
    );

    return { use, client, getSession };
  }),
}) {}

export const createAuthLayerFromHyperdriveResource = Effect.fn(
  "Auth.createLayerFromHyperdriveResource",
)(function* (client: Cloudflare.Hyperdrive.ConnectClient) {
  // Hyperdrive credentials are only available during a Worker invocation.
  const connection = yield* client.connectionString;
  return yield* Auth.make(Redacted.value(connection));
}, Layer.effect(Auth));
