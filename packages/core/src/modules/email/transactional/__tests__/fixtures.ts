import { ConfigProvider, Effect, Layer, Schema } from "effect";
import type {
  CreateEmailOptions,
  CreateEmailRequestOptions,
  CreateEmailResponse,
} from "resend";
import { vi } from "vitest";

import { Id } from "../../../../lib/id/service.js";
import { EmailAddressFromString } from "../../../users/schema.js";

const mock = vi.hoisted(() => ({
  send: vi.fn<
    (
      payload: CreateEmailOptions,
      options?: CreateEmailRequestOptions,
    ) => Promise<CreateEmailResponse>
  >(),
}));

vi.mock("resend", () => ({
  Resend: class {
    readonly emails = { send: mock.send };
  },
}));

export const resendMock = mock;

export const resetEmailMock = () => {
  resendMock.send.mockReset();
  resendMock.send.mockResolvedValue({
    data: { id: "email-id" },
    error: null,
    headers: null,
  });
};

export const EmailTestLayer = Layer.mergeAll(
  ConfigProvider.layer(
    ConfigProvider.fromEnv({
      env: {
        VITE_WEB_URL_BASE: "https://example.com",
        RESEND_API_KEY: "re_test_key",
        EMAIL_FROM_ADDRESS: "sender@example.com",
      },
    }),
  ),
  Layer.succeed(
    Id,
    Id.of({
      generate: () => Effect.succeed("delivery-id"),
      makeFromBrandedSchema: (schema) =>
        Effect.succeed(schema.make("delivery-id")),
    }),
  ),
);

export const recipient = Schema.decodeUnknownSync(EmailAddressFromString)(
  "user@example.com",
);
export const url =
  "https://api.example.com/api/auth/magic-link/verify?token=secret&callbackURL=https%3A%2F%2Fexample.com&errorCallbackURL=https%3A%2F%2Fexample.com";
