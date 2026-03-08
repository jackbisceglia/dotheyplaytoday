---
id: "13"
title: Landing page client MVP
description: Build the public signup landing page in SolidStart and wire it to the typed signup api with shared validation and policy rules
status: TODO
priority: P0
prereqs:
  - 11-web-and-api-scaffold.md
  - 12-public-signup-server-mvp.md
---

**Acceptance:**

- [ ] Build a public landing page in `packages/web` with an email field, send-time selector, timezone capture, and a 6x5 NBA team selection grid.
- [ ] Source team names, topic ids, and display order from the shared core team catalog rather than duplicating constants in the web package.
- [ ] Render logos from web-local static assets while keeping the metadata keyed to the shared core catalog.
- [ ] Use TanStack Form with Effect Schema-backed validation.
- [ ] Keep `onChange` validation lightweight and interactive (bounds, required state, cap checks), and run full schema validation on `onBlur` for email and the final submission payload.
- [ ] Enforce the free-tier team cap from the shared core policy module so frontend and backend use the same source of truth.
- [ ] Once the cap is reached, disable only unchecked teams and show a clear free-plan message while still allowing selected teams to be deselected.
- [ ] Detect timezone from the browser, validate it against the shared schema, and provide a minimal manual fallback if automatic detection is missing or invalid.
- [ ] Offer send-time choices in 15-minute increments that line up with the shared subscription schedule constraint.
- [ ] Submit to the real signup api and show a clean success state; do not implement an authenticated edit flow or a read-by-email preference lookup in this item.
- [ ] Re-submitting the form with the same email should be communicated as the current overwrite mechanism for v1.
- [ ] Ensure the page works on both desktop and mobile and remains keyboard-usable.

**Verify:**

- [ ] Add client tests for validation behavior around bad email input and over-cap team selection.
- [ ] Manually verify the full local flow from landing page submit to persisted signup via the api.
- [ ] Manually verify keyboard navigation and mobile layout behavior.
- [ ] `pnpm typecheck`
- [ ] `pnpm lint`
- [ ] `pnpm format`

**Notes:**

- Use `reference/blank` for TanStack Form validation patterns, but adapt them to SolidStart and Effect Schema rather than copying React-specific structure directly.
- Keep the initial design simple and intentional; do not add auth, account editing, or dashboard-style UI in this item.
- Backend remains the authority for validation even when the frontend mirrors the same rules.
