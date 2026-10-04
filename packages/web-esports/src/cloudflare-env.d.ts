/// <reference types="@cloudflare/workers-types" />

declare namespace Cloudflare {
  // Cloudflare's ambient Env is intentionally augmented by applications.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Env {
    API: Fetcher;
  }
}
