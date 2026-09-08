import * as Cloudflare from "alchemy/Cloudflare";
import { ApiUrl } from "@dtpt/core/lib/config/api";
import { WebUrl } from "@dtpt/core/lib/config/web";
import type { Id } from "@dtpt/core/lib/id/service";
import { sendSignInLink } from "@dtpt/core/modules/email/transactional/sign-in";
import { sendConfirmationLink } from "@dtpt/core/modules/email/transactional/confirmation";
import {
  type EmailAddress,
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
  type GenericEndpointContext,
  type User,
} from "better-auth";
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

type MagicLinkUser = User & { readonly email: EmailAddress };
type MagicLinkContext = { readonly user: MagicLinkUser | null };

const decodeMagicLinkInput = Schema.decodeUnknownOption(
  Schema.Struct({ email: EmailAddressFromString }),
);

// Better Auth does not infer custom hook fields in the sender's generic context.
// Its context merge omits null fields, so normalize an absent user back to null.
const getMagicLinkUser = (
  endpoint: GenericEndpointContext,
): MagicLinkUser | null =>
  (endpoint.context as Partial<MagicLinkContext>).user ?? null;

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
    const webUrl = new URL("/", yield* WebUrl);
    const confirmationUrl = new URL("/?confirmed=1", webUrl).href;
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

          const input = decodeMagicLinkInput(ctx.body);
          if (Option.isNone(input)) return;

          const { email } = input.value;
          const found =
            await ctx.context.internalAdapter.findUserByEmail(email);
          const user = found ? { ...found.user, email } : null;

          // HTTP origin middleware validates caller URLs before this hook runs.
          // This also covers registration's direct server API call.
          return {
            context: {
              body: {
                callbackURL:
                  user && !user.emailVerified ? confirmationUrl : webUrl.href,
                errorCallbackURL: webUrl.href,
              },
              context: { user } satisfies MagicLinkContext,
            },
          };
        }),
      },
      plugins: [
        magicLink({
          disableSignUp: true,
          expiresIn: 15 * 60,
          storeToken: "hashed",
          sendMagicLink: (options, endpoint) => {
            if (endpoint === undefined) return;

            const user = getMagicLinkUser(endpoint);
            if (user === null) return;

            const send = Boolean.match(user.emailVerified, {
              onTrue: () => sendSignInLink(user.email, options.url),
              onFalse: () => sendConfirmationLink(user.email, options.url),
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
