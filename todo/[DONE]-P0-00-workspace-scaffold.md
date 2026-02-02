---
id: "00"
title: Workspace scaffold
description: Set up pnpm workspace, root configs (tsconfig base, eslint, prettier), and package layout for core + scripts
status: DONE
priority: P0
prereqs: []
---

**Acceptance:**

- [ ] `pnpm-workspace.yaml` with `packages/*`
- [ ] Root `package.json` with devDeps (eslint, prettier, typescript)
- [ ] `tsconfig.base.json` with Effect Language Service plugin
- [ ] `packages/core/` with minimal `package.json` (`@dtpt/core`)
- [ ] `packages/scripts/` with minimal `package.json` (`@dtpt/scripts`)
- [ ] `pnpm @core <cmd>` / `pnpm @scripts <cmd>` scripts in root
- [ ] `AGENTS.md` commands work: `pnpm typecheck`, `pnpm lint`, `pnpm format`

**Verify:** Run `pnpm install && pnpm typecheck` with zero errors.

**Notes:**

- **Largely already in place** — this is mostly verifying existing setup is complete and working.
- Reference these repos for patterns and architecture decisions:
  - https://github.com/jackbisceglia/planar — monorepo structure, core/modules split, Effect conventions
  - https://github.com/jackbisceglia/blank — similar stack, minimal setup patterns
  - https://github.com/anomalyco/console — more complex, focus on module organization
  - https://github.com/anomalyco/opencode — CLI/tooling patterns
- **Work interactively with the user** — before committing to major patterns (e.g., directory structure, shared lib naming, service conventions), discuss options and get alignment. This ticket should establish the foundational patterns we’ll use throughout the project.
