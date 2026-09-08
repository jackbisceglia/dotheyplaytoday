import * as Cloudflare from "alchemy/Cloudflare";
import { ApiUrl } from "@dtpt/core/lib/config/api";
import { WebUrl } from "@dtpt/core/lib/config/web";
import type { Id } from "@dtpt/core/lib/id/service";
import { sendSignInLink } from "@dtpt/core/modules/email/transactional/sign-in";
import { sendConfirmationLink } from "@dtpt/core/modules/email/transactional/confirmation";
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
import { createAuthMiddleware } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { magicLink } from "better-auth/plugins";
import {
  Boolean,
  Context,
  Effect,
  Layer,
  Option,
  Redacted,
  Schema,
} from "effect";
import { Pool } from "pg";

import { AuthConfig } from "./config.js";

const decodeEmail = Schema.decodeUnknownSync(EmailAddressFromString);

const createAuthPool = (connectionString: string) =>
  Effect.acquireRelease(
    Effect.sync(() => new Pool({ connectionString, max: 1 })),
    (pool) => Effect.promise(() => pool.end()),
  );

export class AuthRequestError extends Schema.TaggedErrorClass<AuthRequestError>()(
  "AuthRequestError",
  { cause: Schema.Defect() },
) {}

export class Auth extends Context.Service<Auth>()("@dtpt/api/Auth", {
  make: Effect.fn("Auth.make")(function* (connectionString: string) {
    const config = yield* AuthConfig;
    const apiUrl = new URL(yield* ApiUrl);
    const webUrl = new URL(yield* WebUrl);
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
      hooks: {
        before: createAuthMiddleware(async (ctx) => {
          if (ctx.path !== "/sign-in/magic-link") return;

          const body = Schema.decodeUnknownOption(
            Schema.Record(Schema.String, Schema.Unknown),
          )(ctx.body);
          if (Option.isNone(body)) return;
          const email = Schema.decodeUnknownOption(EmailAddressFromString)(
            body.value.email,
          );
          if (Option.isNone(email)) return;
          const user = await ctx.context.internalAdapter.findUserByEmail(
            email.value,
          );
          const callbackURL = new URL("/", webUrl);
          if (user !== null && !user.user.emailVerified) {
            callbackURL.searchParams.set("confirmed", "1");
          }

          // HTTP origin middleware validates caller URLs before this hook runs.
          // This also covers registration's direct server API call.
          return {
            context: {
              body: {
                ...body.value,
                callbackURL: callbackURL.href,
                errorCallbackURL: new URL("/", webUrl).href,
              },
            },
          };
        }),
      },
      plugins: [
        magicLink({
          disableSignUp: true,
          expiresIn: 15 * 60,
          storeToken: "hashed",
          sendMagicLink: async (options, endpoint) => {
            if (endpoint === undefined) return;

            const normalized = decodeEmail(options.email);
            const user =
              await endpoint.context.internalAdapter.findUserByEmail(
                normalized,
              );

            if (user === null) return;

            const send = Boolean.match(user.user.emailVerified, {
              onTrue: () => sendSignInLink(normalized, options.url),
              onFalse: () => sendConfirmationLink(normalized, options.url),
            });

            cloudflare.raw.waitUntil(runPromise(send.pipe(Effect.ignore)));
          },
        }),
      ],
    });

    const use = <A>(f: (auth: typeof client) => PromiseLike<A>) =>
      Effect.tryPromise({
        try: () => f(client),
        catch: (cause) => new AuthRequestError({ cause }),
      });

    return { use, client };
  }),
}) {}

export const createAuthLayerFromHyperdriveResource = Effect.fn(
  "Auth.createLayerFromHyperdriveResource",
)(function* (client: Cloudflare.Hyperdrive.ConnectClient) {
  // Hyperdrive credentials are only available during a Worker invocation.
  const connection = yield* client.connectionString;
  return yield* Auth.make(Redacted.value(connection));
}, Layer.effect(Auth));
