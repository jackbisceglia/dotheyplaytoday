# AGENTS.md

This file contains guidelines for agentic coding agents working in this repository.

## Project Overview

A configurable notification service that checks if a sports team (starting with Boston Celtics) has a game today and sends notifications. Built with Effect, Bun, and TypeScript in a monorepo structure.

**Tech Stack:** Bun, pnpm, Effect, TypeScript (strict), ESLint, Prettier

## Commands

```bash
pnpm typecheck    # Type check all packages
pnpm lint         # ESLint all packages
pnpm format       # Prettier all packages

pnpm @core <cmd>  # Run command in @dtpt/core package (e.g., pnpm @core typecheck)
```

Run all three checks before considering work complete.

## Project Structure

```
dotheyplaytoday/
├── packages/
│   ├── core/     # @dtpt/core - shared core logic
│   └── scripts/  # Build/utility scripts
└── reference/   # Dependency source code for reference (e.g., effect/)
```

## Code Style

- Import Effect utilities directly: `import { Effect, Schema } from "effect"`
- Use `type` keyword (not `interface`) per ESLint rule
- Prefix unused variables with `_`
- Use pnpm `catalog:` for dependencies shared across packages

## Local Standards (Project-Specific)

- Avoid barrel files; prefer direct module imports (core `src/index.ts` stays empty unless required).
- Favor minimal abstraction early; only extract helpers/types once there are 3+ callsites or clear immediate reuse.
- Colocate schema primitives with their owning schema/module; do not create shared primitives until 3+ callsites.
- IDs: embed ID schemas directly in the owning struct; callers can reference `Struct.fields.id` when needed.
- Branding: prefer branding only IDs; do not brand other primitives unless a concrete need appears.
- Schema annotations: skip `.annotations(...)` unless there is a clear, immediate use (docs, JSON schema, tooling).
- Tests: each schema should have positive + negative cases plus edge cases; for simple decoding use `Schema.decodeUnknownEither`.
- Test utilities: only extract to shared utils when reuse is certain; if so, place in `packages/core/src/tests/`.
- Export order preference for schemas: `export type` before `export const`.

## Effect Best Practices

**IMPORTANT:** Always consult effect-solutions before writing Effect code.

1. Run `effect-solutions list` to see available guides
2. Run `effect-solutions show <topic>...` for relevant patterns (supports multiple topics)
3. Search `reference/effect/` for real implementations

Topics: quick-start, project-setup, tsconfig, basics, services-and-layers, data-modeling, error-handling, config, testing, cli.

Never guess at Effect patterns - check the guide first.

### Local Source References

The `reference/` directory contains cloned source repositories for reference.
Use this to explore APIs, find usage examples, and understand implementation details when documentation isn't enough.

### Effect Language Service

This project uses the Effect Language Service for compile-time diagnostics. The plugin is configured in `tsconfig.base.json` and TypeScript has been patched to enable build-time checking.

**If you reinstall dependencies, run:**

```bash
pnpm exec effect-language-service patch
```
