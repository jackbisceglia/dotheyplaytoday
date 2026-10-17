import { makeAuthFixture } from "./fixtures.js";
import { describe, expect, it } from "vitest";
import { Schema } from "effect";

type Fixture = Awaited<ReturnType<typeof makeAuthFixture>>;

const makeVerifiedFixture = async () => {
  const f = await makeAuthFixture();
  await f.database.exec("UPDATE users SET email_verified = true");
  return f;
};

const sendCode = (f: Fixture, email: string, type = "sign-in") =>
  f.auth.client.handler(
    f.request("/email-otp/send-verification-otp", { email, type }),
  );

const signIn = (f: Fixture, otp: string, email = "user@example.com") =>
  f.auth.client.handler(f.request("/sign-in/email-otp", { email, otp }));

const issuedCode = async (f: Fixture, index = 0, sender = f.sendSignInCode) => {
  await Promise.all(f.pending);
  const code = sender.mock.calls[index]?.[1];
  if (!code) throw new Error("Missing code");
  return code;
};

const wrong = (code: string) => (code === "000000" ? "111111" : "000000");

const errorCode = async (response: Response) =>
  Schema.decodeUnknownSync(Schema.Struct({ code: Schema.String }))(
    await response.json(),
  ).code;

const isVerified = async (f: Fixture) =>
  (await f.rows("users"))[0]?.email_verified;

describe("email sign-in codes", () => {
  it.each([false, true])(
    "selects the code email by stored verification state and redeems once (verified: %s)",
    async (verified) => {
      const f = await makeAuthFixture();
      await f.database.query("UPDATE users SET email_verified = $1", [
        verified,
      ]);
      const response = await sendCode(f, " User@Example.COM ");
      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ success: true });

      const sender = verified ? f.sendSignInCode : f.sendConfirmationCode;
      const other = verified ? f.sendConfirmationCode : f.sendSignInCode;
      const code = await issuedCode(f, 0, sender);
      expect(sender).toHaveBeenCalledExactlyOnceWith(
        "user@example.com",
        expect.stringMatching(/^\d{6}$/),
      );
      expect(other).not.toHaveBeenCalled();
      expect(f.sendSignInLink).not.toHaveBeenCalled();
      expect(f.sendConfirmationLink).not.toHaveBeenCalled();
      // The code is hashed at rest.
      const [stored] = await f.rows("auth_verifications");
      expect(stored?.identifier).toBe("sign-in-otp-user@example.com");
      expect(stored?.value).not.toContain(code);

      const redeemed = await signIn(f, code, " User@Example.COM ");
      expect(redeemed.status).toBe(200);
      expect(redeemed.headers.get("set-cookie")).toContain("session_token");
      const body: unknown = await redeemed.json();
      expect(body).toHaveProperty("token", expect.any(String));
      if (verified) {
        expect(body).not.toHaveProperty("confirmation");
      } else {
        expect(body).toHaveProperty("confirmation", true);
      }
      expect(await isVerified(f)).toBe(true);
      expect(await f.rows("auth_sessions")).toHaveLength(1);

      const reused = await signIn(f, code);
      expect(reused.status).toBe(400);
      expect(await errorCode(reused)).toBe("INVALID_OTP");
      expect(await f.rows("auth_sessions")).toHaveLength(1);
      expect(await f.rows("users")).toHaveLength(1);
    },
  );

  it("allows only one concurrent redemption of a confirmation code", async () => {
    const f = await makeAuthFixture();
    await sendCode(f, "user@example.com");
    const code = await issuedCode(f, 0, f.sendConfirmationCode);
    const responses = await Promise.all([signIn(f, code), signIn(f, code)]);
    expect(responses.map((response) => response.status).sort()).toEqual([
      200, 400,
    ]);
    for (const response of responses) {
      const body = await response.json();
      if (response.status === 200) {
        expect(body).toHaveProperty("confirmation", true);
      } else {
        expect(body).toEqual({ code: "INVALID_OTP", message: "Invalid OTP" });
      }
    }
    expect(await isVerified(f)).toBe(true);
    expect(await f.rows("auth_sessions")).toHaveLength(1);
  });

  it("sends sign-in copy without the confirmation marker once confirmed by code", async () => {
    const f = await makeAuthFixture();
    await sendCode(f, "user@example.com");
    await signIn(f, await issuedCode(f, 0, f.sendConfirmationCode));

    await sendCode(f, "user@example.com");
    const response = await signIn(f, await issuedCode(f, 0, f.sendSignInCode));
    expect(response.status).toBe(200);
    expect(await response.json()).not.toHaveProperty("confirmation");
    expect(f.sendConfirmationCode).toHaveBeenCalledOnce();
  });

  it("keeps unknown addresses generic without delivery or account creation", async () => {
    const f = await makeAuthFixture();
    const response = await sendCode(f, "unknown@example.com");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    await Promise.all(f.pending);
    for (const sender of [
      f.sendSignInCode,
      f.sendConfirmationCode,
      f.sendSignInLink,
      f.sendConfirmationLink,
    ]) {
      expect(sender).not.toHaveBeenCalled();
    }
    expect(await f.rows("auth_verifications")).toEqual([]);

    const redeemed = await signIn(f, "123456", "unknown@example.com");
    expect(redeemed.status).toBe(400);
    expect(await errorCode(redeemed)).toBe("INVALID_OTP");
    expect(await f.rows("users")).toHaveLength(1);
    expect(await f.rows("auth_sessions")).toEqual([]);
  });

  it("does not confirm or reveal status on a failed redemption", async () => {
    const f = await makeAuthFixture();
    await sendCode(f, "user@example.com");
    const code = await issuedCode(f, 0, f.sendConfirmationCode);
    const response = await signIn(f, wrong(code));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      code: "INVALID_OTP",
      message: "Invalid OTP",
    });
    expect(await isVerified(f)).toBe(false);
    expect(await f.rows("auth_sessions")).toEqual([]);
  });

  it("rejects non-sign-in code types and disabled OTP endpoints", async () => {
    const f = await makeVerifiedFixture();
    for (const type of ["email-verification", "forget-password"]) {
      const response = await sendCode(f, "user@example.com", type);
      expect(response.status).toBe(400);
    }
    for (const path of [
      "/email-otp/verify-email",
      "/email-otp/check-verification-otp",
      "/email-otp/request-password-reset",
      "/email-otp/reset-password",
      "/forget-password/email-otp",
      "/email-otp/request-email-change",
      "/email-otp/change-email",
    ]) {
      const response = await f.auth.client.handler(
        f.request(path, { email: "user@example.com", otp: "123456" }),
      );
      expect(response.status).toBe(404);
    }
    await Promise.all(f.pending);
    expect(f.sendSignInCode).not.toHaveBeenCalled();
    expect(await f.rows("auth_verifications")).toEqual([]);
  });

  it("rejects expired codes without confirming", async () => {
    const f = await makeAuthFixture();
    await sendCode(f, "user@example.com");
    const code = await issuedCode(f, 0, f.sendConfirmationCode);
    const [stored] = await f.rows("auth_verifications");
    const expiresAt = stored?.expires_at;
    if (!(expiresAt instanceof Date)) throw new Error("Missing expiry");
    const ttl = expiresAt.getTime() - Date.now();
    expect(ttl).toBeGreaterThan(9 * 60 * 1000);
    expect(ttl).toBeLessThanOrEqual(10 * 60 * 1000);

    await f.database.exec(
      "UPDATE auth_verifications SET expires_at = now() - interval '1 second'",
    );
    const response = await signIn(f, code);
    expect(response.status).toBe(400);
    expect(await errorCode(response)).toBe("OTP_EXPIRED");
    expect(await isVerified(f)).toBe(false);
    expect(await f.rows("auth_sessions")).toEqual([]);
  });

  it("invalidates a code after three incorrect attempts", async () => {
    const f = await makeVerifiedFixture();
    await sendCode(f, "user@example.com");
    const code = await issuedCode(f);
    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await signIn(f, wrong(code));
      expect(response.status).toBe(400);
      expect(await errorCode(response)).toBe("INVALID_OTP");
    }
    const locked = await signIn(f, code);
    expect(locked.status).toBe(403);
    expect(await errorCode(locked)).toBe("TOO_MANY_ATTEMPTS");
    const consumed = await signIn(f, code);
    expect(consumed.status).toBe(400);
    expect(await f.rows("auth_sessions")).toEqual([]);
  });

  it("replaces the previous code on resend", async () => {
    const f = await makeVerifiedFixture();
    await sendCode(f, "user@example.com");
    const first = await issuedCode(f, 0);
    await sendCode(f, "user@example.com");
    const second = await issuedCode(f, 1);
    expect(f.sendSignInCode).toHaveBeenCalledTimes(2);

    if (first !== second) {
      const stale = await signIn(f, first);
      expect(stale.status).toBe(400);
      expect(await errorCode(stale)).toBe("INVALID_OTP");
    }
    const response = await signIn(f, second);
    expect(response.status).toBe(200);
    expect(await f.rows("auth_sessions")).toHaveLength(1);
  });

  it("rate limits code requests per client", async () => {
    const f = await makeAuthFixture();
    for (let attempt = 0; attempt < 6; attempt++) {
      const response = await sendCode(f, "unknown@example.com");
      expect(response.status).toBe(attempt < 5 ? 200 : 429);
    }
  });
});
