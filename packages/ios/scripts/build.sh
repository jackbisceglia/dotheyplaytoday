#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if ! command -v xcodebuild >/dev/null 2>&1; then
  echo "Building the iOS app requires macOS and Xcode 16 or newer. Portable tests: swift test." >&2
  exit 1
fi
xcodebuild -project DoTheyPlayToday.xcodeproj \
  -scheme DoTheyPlayToday \
  -configuration Debug \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath build \
  CODE_SIGNING_ALLOWED=NO build "$@"
