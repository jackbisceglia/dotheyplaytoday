import * as Cloudflare from "alchemy/Cloudflare";
import { ApiUrl } from "@dtpt/core/lib/config/api";
import { WebUrl } from "@dtpt/core/lib/config/web";
import { Id } from "@dtpt/core/lib/id/service";
import {
  MagicLink,
  sendMagicLink,
} from "@dtpt/core/modules/email/transactional/magic-link";
import { EmailAddressFromString } from "@dtpt/core/modules/users/schema";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { Config, Context, Effect, Layer, Redacted, Schema } from "effect";
import { Pool } from "pg";

const timestamps = {
  createdAt: "created_at",
  updatedAt: "updated_at",
} as const;

const createAuthPool = Effect.fn("Auth.createPool")(function* <E, R>(
  connectionString: Effect.Effect<Redacted.Redacted, E, R>,
) {
  const url = Redacted.value(yield* connectionString);
  return yield* Effect.acquireRelease(
    Effect.sync(() => new Pool({ connectionString: url, max: 1 })),
    (pool) => Effect.promise(() => pool.end()),
  );
});

export const createAuth = Effect.fn("Auth.create")(function* <E, R>(
  connectionString: Effect.Effect<Redacted.Redacted, E, R>,
) {
  const secret = yield* Config.redacted("BETTER_AUTH_SECRET");
  const apiUrl = new URL(yield* ApiUrl);
  const webUrl = yield* WebUrl;
  const pool = yield* createAuthPool(connectionString);
  const id = yield* Id;
  const { raw: executionContext } = yield* Cloudflare.WorkerExecutionContext;
  const runPromise = Effect.runPromiseWith(yield* Effect.context());

  return betterAuth({
    appName: "dotheyplaytoday",
    basePath: "/api/auth",
    baseURL: apiUrl.origin,
    secret: Redacted.value(secret),
    trustedOrigins: [apiUrl.origin, webUrl],
    database: pool,
    // Profile editing belongs to the deferred account experience. In particular,
    // the shared users table intentionally has no Better Auth image column.
    disabledPaths: ["/update-user"],
    user: {
      modelName: "users",
      fields: {
        emailVerified: "email_verified",
        ...timestamps,
      },
    },
    session: {
      modelName: "auth_sessions",
      fields: {
        expiresAt: "expires_at",
        ipAddress: "ip_address",
        userAgent: "user_agent",
        userId: "user_id",
        ...timestamps,
      },
    },
    account: {
      modelName: "auth_accounts",
      fields: {
        accountId: "account_id",
        providerId: "provider_id",
        userId: "user_id",
        accessToken: "access_token",
        refreshToken: "refresh_token",
        idToken: "id_token",
        accessTokenExpiresAt: "access_token_expires_at",
        refreshTokenExpiresAt: "refresh_token_expires_at",
        ...timestamps,
      },
    },
    verification: {
      modelName: "auth_verifications",
      fields: {
        expiresAt: "expires_at",
        ...timestamps,
      },
    },
    emailAndPassword: { enabled: false },
    socialProviders: {},
    rateLimit: {
      enabled: true,
      storage: "memory",
      window: 60,
      max: 100,
      customRules: {
        "/sign-in/magic-link": { window: 60, max: 5 },
        "/magic-link/verify": { window: 60, max: 10 },
      },
    },
    advanced: {
      disableOriginCheck: false,
      useSecureCookies: apiUrl.protocol === "https:",
      crossSubDomainCookies: { enabled: false },
      ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] },
    },
    plugins: [
      magicLink({
        disableSignUp: true,
        expiresIn: 15 * 60,
        storeToken: "hashed",
        sendMagicLink: async ({ email, url }, context) => {
          if (context === undefined) return;

          const normalized = Schema.decodeUnknownSync(EmailAddressFromString)(
            email,
          );
          const user =
            await context.context.internalAdapter.findUserByEmail(normalized);

          if (user === null) return;

          executionContext.waitUntil(
            runPromise(
              sendMagicLink(
                MagicLink.make({ recipient: normalized, url }),
              ).pipe(Effect.provideService(Id, id), Effect.ignore),
            ),
          );
        },
      }),
    ],
  });
});

export class Auth extends Context.Service<
  Auth,
  Effect.Success<ReturnType<typeof createAuth>>
>()("@dtpt/api/Auth") {}

export const createAuthLayer = <E, R>(
  connectionString: Effect.Effect<Redacted.Redacted, E, R>,
) => Layer.effect(Auth, createAuth(connectionString));
