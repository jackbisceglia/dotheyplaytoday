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
└── .reference/   # Dependency source code for reference (e.g., effect/)
```

## Code Style

- Import Effect utilities directly: `import { Effect, Schema } from "effect"`
- Use `type` keyword (not `interface`) per ESLint rule
- Prefix unused variables with `_`
- Use pnpm `catalog:` for dependencies shared across packages

## Effect Best Practices

**IMPORTANT:** Always consult effect-solutions before writing Effect code.

1. Run `effect-solutions list` to see available guides
2. Run `effect-solutions show <topic>...` for relevant patterns (supports multiple topics)
3. Search `.reference/effect/` for real implementations

Topics: quick-start, project-setup, tsconfig, basics, services-and-layers, data-modeling, error-handling, config, testing, cli.

Never guess at Effect patterns - check the guide first.

### Local Source References

The `.reference/` directory contains cloned source repositories for reference.
Use this to explore APIs, find usage examples, and understand implementation details when documentation isn't enough.

### Effect Language Service

This project uses the Effect Language Service for compile-time diagnostics. The plugin is configured in `tsconfig.base.json` and TypeScript has been patched to enable build-time checking.

**If you reinstall dependencies, run:**

```bash
pnpm exec effect-language-service patch
```
