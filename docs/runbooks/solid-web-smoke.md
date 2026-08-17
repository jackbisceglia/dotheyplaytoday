# Solid Web smoke runbook

Run this checklist against `alchemy dev`, then repeat it against the generated
production Web `workers.dev` URL after deployment.

## Setup

1. Run `pnpm build`.
2. For local integration, run `pnpm dev:infra` and use the Web URL printed by
   Alchemy.
3. Use `pnpm dev:web` only for a standalone Vite session. It reads
   `VITE_API_URL_BASE` and `VITE_API_URL_PORT` from the workspace `.env`, but
   does not provision the API service binding used by integrated SSR.
4. For production, set `VITE_WEB_URL_BASE` to the exact Web Worker origin
   before deployment so API CORS permits that one origin. The production Worker
   name is `dotheyplaytoday-web-production`.
5. Keep browser developer tools open and confirm there are no hydration
   warnings, failed static assets, or unexpected duplicate subject requests.

## Home and signup

1. Open `/` directly at desktop and mobile widths. Compare the header, hero,
   ticker, form, typography, spacing, colors, and responsive layout with the
   last known-good Astro deployment.
2. Follow the skip link and both signup hash links. Confirm focus/scroll lands
   at the expected content and the browser URL retains `#signup`.
3. Switch through every available league and confirm only its team grid is
   visible.
4. Select and deselect teams across leagues. Confirm selections persist while
   switching leagues and the capacity message prevents an extra selection.
5. Submit an empty form. Confirm the first visible team receives focus and the
   persistent alert announces `Pick at least one team.`
6. Select a team and submit an invalid email. Confirm the email receives focus,
   `aria-invalid`, and the established validation message.
7. Submit valid data. Confirm the button disables and reads `Signing up...`,
   then the success heading receives focus.
8. Choose `Edit my picks`. Confirm the original email, send time, and teams are
   retained and focus returns to email.
9. Reproduce an API error and a request longer than 15 seconds. Confirm inputs
   remain, the generic retry message appears, and the button re-enables.

## Routing and unsubscribe

1. Navigate from an internal Home link and use browser back/forward. Confirm
   Solid Router handles navigation without a full reload and hash behavior is
   unchanged.
2. Open a valid `/unsubscribe/:token` directly. Submit it and confirm the button
   disables, success content appears, and its heading receives focus.
3. Reproduce an unsubscribe rate limit and a request longer than 15 seconds.
   Confirm the established error appears and the button re-enables.
4. Open an invalid unsubscribe token directly and through client navigation.
   Confirm the not-found UI and an HTTP 404 on the direct response.
5. Open an unknown path directly and through client navigation. Confirm the
   not-found UI and an HTTP 404 on the direct response.
6. Use every Home/Back home link and confirm it resolves to `/` through the
   typed route path.

## Rollout

1. Confirm client output contains no `.env`, filesystem modules, database
   credentials, or secret values.
2. Confirm hashed JS/CSS assets are served without invoking the SSR Worker and
   page requests preserve streamed bodies, headers, and statuses.
3. Repeat desktop/mobile screenshots and this runbook against production.
4. If production behavior fails, redeploy the last known-good Astro revision.
