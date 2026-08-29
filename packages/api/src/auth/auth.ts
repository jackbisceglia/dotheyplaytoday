import * as Cloudflare from "alchemy/Cloudflare";
import { ApiUrl } from "@dtpt/core/lib/config/api";
import { WebUrl } from "@dtpt/core/lib/config/web";
import { Database } from "@dtpt/core/lib/database/service";
import { Id } from "@dtpt/core/lib/id/service";
import {
  authAccountsTable,
  authSessionsTable,
  authVerificationsTable,
} from "@dtpt/core/modules/auth/schema";
import {
  MagicLink,
  sendMagicLink,
} from "@dtpt/core/modules/email/transactional/magic-link";
import {
  EmailAddressFromString,
  usersTable,
} from "@dtpt/core/modules/users/schema";
import { Users } from "@dtpt/core/modules/users/service";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { Context, Effect, Redacted, Schema } from "effect";

import { AuthConfig } from "./config.js";
import { makeAuthDatabase } from "./database.js";

const schema = {
  user: usersTable,
  session: authSessionsTable,
  account: authAccountsTable,
  verification: authVerificationsTable,
};

export const Auth = Effect.gen(function* () {
  const authConfig = yield* AuthConfig;
  const apiUrl = new URL(yield* ApiUrl);
  const webUrl = new URL(yield* WebUrl);
  const database = yield* Database;
  const users = yield* Users;
  const id = yield* Id;
  const executionContext = yield* Cloudflare.WorkerExecutionContext;

  return (context: Context.Context<never>) => {
    const runPromise = Effect.runPromiseWith(context);

    return betterAuth({
      appName: "dotheyplaytoday",
      basePath: "/api/auth",
      baseURL: apiUrl.origin,
      secret: Redacted.value(authConfig.secret),
      trustedOrigins: [apiUrl.origin, webUrl.origin],
      database: drizzleAdapter(makeAuthDatabase(database.$client, runPromise), {
        provider: "pg",
        schema,
        transaction: false,
      }),
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
        useSecureCookies: apiUrl.protocol === "https:",
        crossSubDomainCookies: { enabled: false },
        ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] },
        backgroundTasks: {
          handler: (promise) => {
            executionContext.raw.waitUntil(promise);
          },
        },
      },
      plugins: [
        magicLink({
          disableSignUp: true,
          expiresIn: 15 * 60,
          storeToken: "hashed",
          rateLimit: { window: 60, max: 5 },
          sendMagicLink: ({ email, url }) =>
            runPromise(
              Effect.gen(function* () {
                const normalized = yield* Schema.decodeUnknownEffect(
                  EmailAddressFromString,
                )(email);
                const user = yield* users.getByEmail(normalized);

                yield* Effect.sync(() => {
                  executionContext.raw.waitUntil(
                    runPromise(
                      sendMagicLink(
                        MagicLink.make({ recipient: user.email, url }),
                      ).pipe(Effect.provideService(Id, id), Effect.ignore),
                    ),
                  );
                });
              }).pipe(
                Effect.catchTag("UserNotFound", () => Effect.void),
                Effect.orDie,
              ),
            ),
        }),
      ],
    });
  };
});

export type Auth = ReturnType<Effect.Success<typeof Auth>>;
