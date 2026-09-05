import * as Cloudflare from "alchemy/Cloudflare";
import { ApiUrl } from "@dtpt/core/lib/config/api";
import { WebUrl } from "@dtpt/core/lib/config/web";
import { Id } from "@dtpt/core/lib/id/service";
import {
  MagicLink,
  sendMagicLink,
} from "@dtpt/core/modules/email/transactional/magic-link";
import {
  EmailAddressFromString,
  usersTable,
} from "@dtpt/core/modules/users/schema";
import {
  authAccountsTable,
  authSessionsTable,
  authVerificationsTable,
} from "@dtpt/core/modules/auth/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { magicLink } from "better-auth/plugins";
import { Config, Context, Effect, Layer, Redacted, Schema } from "effect";
import { Pool } from "pg";

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
    disabledPaths: ["/update-user"],
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
