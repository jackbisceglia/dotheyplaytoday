import { EmailAddressFromString } from "@dtpt/core/modules/users/schema";
import { eq } from "drizzle-orm";
import { Redacted, Schema } from "effect";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";

import type { AuthConfig } from "./config.js";
import { type AuthDatabase, authDatabaseSchema } from "./database.js";

export const authModelNames = {
  user: "users",
  session: "authSessions",
  account: "authAccounts",
  verification: "authVerifications",
} as const;

export type MagicLinkDelivery = (
  email: typeof EmailAddressFromString.Type,
  url: string,
) => Promise<void>;

export const makeMagicLinkSender =
  (options: {
    readonly userExists: (
      email: typeof EmailAddressFromString.Type,
    ) => Promise<boolean>;
    readonly deliver: MagicLinkDelivery;
    readonly defer: (promise: Promise<unknown>) => void;
  }) =>
  async ({ email, url }: { readonly email: string; readonly url: string }) => {
    const normalized = Schema.decodeUnknownSync(EmailAddressFromString)(email);
    const userExists = await options.userExists(normalized);

    // The endpoint still returns the same success response for an unknown
    // address, but no message is sent and Better Auth cannot provision it.
    if (!userExists) return;

    options.defer(
      options.deliver(normalized, url).catch((error: unknown) => {
        console.error("magic link: delivery failed", error);
      }),
    );
  };

export const createAuth = (options: {
  readonly database: AuthDatabase;
  readonly config: AuthConfig;
  readonly deliver: MagicLinkDelivery;
  readonly defer: (promise: Promise<unknown>) => void;
  readonly secureCookies: boolean;
}) =>
  betterAuth({
    appName: "dotheyplaytoday",
    basePath: "/api/auth",
    baseURL: options.config.baseURL,
    secret: Redacted.value(options.config.secret),
    trustedOrigins: options.config.trustedOrigins,
    database: drizzleAdapter(options.database, {
      provider: "pg",
      schema: authDatabaseSchema,
      transaction: true,
    }),
    user: { modelName: authModelNames.user },
    session: { modelName: authModelNames.session },
    account: { modelName: authModelNames.account },
    verification: { modelName: authModelNames.verification },
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
      useSecureCookies: options.secureCookies,
      crossSubDomainCookies: { enabled: false },
      ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] },
      backgroundTasks: { handler: options.defer },
    },
    plugins: [
      magicLink({
        disableSignUp: true,
        expiresIn: 15 * 60,
        storeToken: "hashed",
        rateLimit: { window: 60, max: 5 },
        sendMagicLink: makeMagicLinkSender({
          userExists: async (email) => {
            const [user] = await options.database
              .select({ id: authDatabaseSchema.users.id })
              .from(authDatabaseSchema.users)
              .where(eq(authDatabaseSchema.users.email, email))
              .limit(1);

            return user !== undefined;
          },
          deliver: options.deliver,
          defer: options.defer,
        }),
      }),
    ],
  });

export type Auth = ReturnType<typeof createAuth>;
