import type * as Cloudflare from "alchemy/Cloudflare";
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
import { Context, Effect, Layer, Redacted, Schema } from "effect";
import type { Pool } from "pg";

import { AuthConfig } from "./config.js";
import { openAuthPool } from "./pool.js";

const timestamps = {
  createdAt: "created_at",
  updatedAt: "updated_at",
} as const;

type RunPromise = <A, E>(effect: Effect.Effect<A, E>) => Promise<A>;

const createAuth = (input: {
  readonly apiUrl: URL;
  readonly webUrl: URL;
  readonly secret: Redacted.Redacted;
  readonly pool: Pool;
  readonly id: Id["Service"];
  readonly runPromise: RunPromise;
  readonly defer: (promise: Promise<unknown>) => void;
}) =>
  betterAuth({
    appName: "dotheyplaytoday",
    basePath: "/api/auth",
    baseURL: input.apiUrl.origin,
    secret: Redacted.value(input.secret),
    trustedOrigins: [input.apiUrl.origin, input.webUrl.origin],
    database: input.pool,
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
      window: 60,
      max: 100,
      customRules: {
        "/sign-in/magic-link": { window: 60, max: 5 },
        "/magic-link/verify": { window: 60, max: 10 },
      },
    },
    advanced: {
      useSecureCookies: input.apiUrl.protocol === "https:",
      crossSubDomainCookies: { enabled: false },
      ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] },
      backgroundTasks: { handler: input.defer },
    },
    plugins: [
      magicLink({
        disableSignUp: true,
        expiresIn: 15 * 60,
        storeToken: "hashed",
        rateLimit: { window: 60, max: 5 },
        sendMagicLink: async ({ email, url }, context) => {
          if (context === undefined) return;

          const normalized = await input.runPromise(
            Schema.decodeUnknownEffect(EmailAddressFromString)(email),
          );
          const user =
            await context.context.internalAdapter.findUserByEmail(normalized);

          if (user === null) return;

          input.defer(
            input.runPromise(
              sendMagicLink(
                MagicLink.make({ recipient: normalized, url }),
              ).pipe(Effect.provideService(Id, input.id), Effect.ignore),
            ),
          );
        },
      }),
    ],
  });

export type AuthInstance = ReturnType<typeof createAuth>;

export class Auth extends Context.Service<Auth, AuthInstance>()(
  "@dtpt/api/Auth",
) {}

export const makeAuthLayer = (
  connectionString: Cloudflare.Hyperdrive.ConnectClient["connectionString"],
) =>
  Layer.effect(
    Auth,
    Effect.gen(function* () {
      const authConfig = yield* AuthConfig;
      const apiUrl = new URL(yield* ApiUrl);
      const webUrl = new URL(yield* WebUrl);
      const id = yield* Id;
      const pool = yield* openAuthPool(connectionString);
      const pending: Promise<unknown>[] = [];

      // Registered after the pool finalizer so LIFO cleanup drains pending
      // auth and email work before closing PostgreSQL.
      yield* Effect.addFinalizer(() =>
        Effect.promise(() => Promise.allSettled(pending)).pipe(Effect.asVoid),
      );

      const context = yield* Effect.context();

      return Auth.of(
        createAuth({
          apiUrl,
          webUrl,
          secret: authConfig.secret,
          pool,
          id,
          runPromise: Effect.runPromiseWith(context),
          defer: (promise) => {
            pending.push(promise);
          },
        }),
      );
    }),
  );
