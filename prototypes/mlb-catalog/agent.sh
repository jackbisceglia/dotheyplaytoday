#!/bin/bash
set -euo pipefail
mkdir -p "$HOME"
pnpm install --frozen-lockfile >&2
exec claude --bare --print --output-format json --no-session-persistence \
  --dangerously-skip-permissions --strict-mcp-config --mcp-config '{"mcpServers":{}}' \
  --setting-sources '' --model "$MLB_MODEL" --max-turns 80 --max-budget-usd 5 \
  --tools 'Bash,Read,Edit,Write,Glob,Grep,WebFetch,WebSearch' \
  --json-schema "$(cat /instructions/result.schema.json)" \
  -- "$(cat /instructions/prompt.md)"
