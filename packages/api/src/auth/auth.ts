import * as Cloudflare from "alchemy/Cloudflare";
import { ApiUrl } from "@dtpt/core/lib/config/api";
import { WebUrl } from "@dtpt/core/lib/config/web";
import type { Id } from "@dtpt/core/lib/id/service";
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
import { Context, Effect, Layer, Redacted, Schema } from "effect";
import { Pool } from "pg";

import { AuthBasePath, AuthConfig } from "./config.js";

const decodeEmail = Schema.decodeUnknownSync(EmailAddressFromString);

const createAuthPool = (connectionString: string) =>
  Effect.acquireRelease(
    Effect.sync(() => new Pool({ connectionString, max: 1 })),
    (pool) => Effect.promise(() => pool.end()),
  );

export class Auth extends Context.Service<Auth>()("@dtpt/api/Auth", {
  make: Effect.fn("Auth.make")(function* (connectionString: string) {
    const { secret } = yield* AuthConfig;
    const apiUrl = new URL(yield* ApiUrl);
    const webUrl = new URL(yield* WebUrl);
    const pool = yield* createAuthPool(connectionString);
    const ctx = yield* Cloudflare.WorkerExecutionContext;
    // Preserve runtime config and Id when Better Auth calls back into Effect.
    const runPromise = Effect.runPromiseWith(yield* Effect.context<Id>());

    return betterAuth({
      appName: "dotheyplaytoday",
      basePath: AuthBasePath,
      baseURL: apiUrl.origin,
      secret: Redacted.value(secret),
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
      disabledPaths: ["/update-user"],
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
        disableOriginCheck: false,
        useSecureCookies: apiUrl.protocol === "https:",
        ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] },
      },
      plugins: [
        magicLink({
          disableSignUp: true,
          expiresIn: 15 * 60,
          storeToken: "hashed",
          sendMagicLink: async ({ email, url }, context) => {
            if (context === undefined) return;

            const normalized = decodeEmail(email);
            const user =
              await context.context.internalAdapter.findUserByEmail(normalized);

            if (user === null) return;

            ctx.raw.waitUntil(
              runPromise(
                sendMagicLink(
                  MagicLink.make({ recipient: normalized, url }),
                ).pipe(Effect.ignore),
              ),
            );
          },
        }),
      ],
    });
  }),
}) {
  static layer = (connectionString: string) =>
    Layer.effect(Auth, Auth.make(connectionString));
}
