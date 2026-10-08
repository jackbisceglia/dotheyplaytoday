/// <reference types="@cloudflare/workers-types" />

declare namespace Cloudflare {
  // Cloudflare's ambient Env is intentionally augmented by applications.
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface Env {
    API: Fetcher;
  }
}
