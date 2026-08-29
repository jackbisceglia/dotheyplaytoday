import type { Auth } from "./auth.js";

export const isAuthRequest = (request: Request) =>
  new URL(request.url).pathname.startsWith("/api/auth/");

const magicLinkSignInPath = "/api/auth/sign-in/magic-link";

const prepareMagicLinkRequest = async (request: Request, webOrigin: string) => {
  const url = new URL(request.url);
  if (request.method !== "POST" || url.pathname !== magicLinkSignInPath) {
    return request;
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) return request;

  const body: unknown = await request.clone().json();
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return request;
  }

  const input = body as Record<string, unknown>;
  const normalizedEmail =
    typeof input.email === "string"
      ? input.email.trim().toLowerCase()
      : input.email;

  const headers = new Headers(request.headers);
  headers.delete("content-length");

  return new Request(request, {
    headers,
    body: JSON.stringify({
      ...input,
      email: normalizedEmail,
      callbackURL: `${webOrigin}/`,
    }),
  });
};

export const withCredentialedAuthCors = (
  request: Request,
  response: Response,
  webOrigin: string,
) => {
  const origin = request.headers.get("origin");
  if (origin !== webOrigin) return response;

  const headers = new Headers(response.headers);
  headers.set("access-control-allow-origin", webOrigin);
  headers.set("access-control-allow-credentials", "true");
  headers.set("access-control-allow-methods", "GET, POST, OPTIONS");
  headers.set("access-control-allow-headers", "Content-Type");
  headers.append("vary", "Origin");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const handleAuthRequest = async (
  request: Request,
  auth: Auth,
  webOrigin: string,
) => {
  if (request.method === "OPTIONS") {
    return withCredentialedAuthCors(
      request,
      new Response(null, { status: 204 }),
      webOrigin,
    );
  }

  const prepared = await prepareMagicLinkRequest(request, webOrigin);
  const response = await auth.handler(prepared);

  return withCredentialedAuthCors(request, response, webOrigin);
};
