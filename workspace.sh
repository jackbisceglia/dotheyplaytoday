#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(
  cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1
  pwd
)"

REFERENCE_DIR="$SCRIPT_DIR/reference"

# Fail fast if a remote requires interactive credentials.
export GIT_TERMINAL_PROMPT=0

repos=(
  "blank|git@github.com:jackbisceglia/blank.git"
  "console|git@github.com:anomalyco/console.git"
  "effectv4|git@github.com:Effect-TS/effect-smol.git"
  "opencode|git@github.com:anomalyco/opencode.git"
  "planar|git@github.com:jackbisceglia/planar.git"
  "t3code|git@github.com:pingdotgg/t3code.git"
)

clone_repo() {
  local name="$1"
  local url="$2"
  local target_dir="$REFERENCE_DIR/$name"
  local existing_origin

  if [ -d "$target_dir/.git" ] || [ -f "$target_dir/.git" ]; then
    if ! git -C "$target_dir" rev-parse --verify HEAD >/dev/null 2>&1; then
      printf 'reset %s (incomplete clone)\n' "$name"
      rm -rf "$target_dir"
    else
      existing_origin="$(git -C "$target_dir" remote get-url origin 2>/dev/null || true)"
      if [ "$existing_origin" = "$url" ]; then
        printf 'skip %s (already cloned)\n' "$name"
      else
        printf 'skip %s (existing origin: %s)\n' "$name" "${existing_origin:-unknown}"
      fi
      return
    fi
  fi

  if [ -e "$target_dir" ]; then
    printf 'error %s exists but is not a git repo\n' "$target_dir" >&2
    exit 1
  fi

  printf 'clone %s\n' "$name"
  git clone --depth 1 "$url" "$target_dir"
}

mkdir -p "$REFERENCE_DIR"

for entry in "${repos[@]}"; do
  name="${entry%%|*}"
  url="${entry#*|}"
  clone_repo "$name" "$url"
done
