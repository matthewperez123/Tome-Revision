#!/usr/bin/env bash
#
# tome-deploy Stage 4 — pre-flight gate.
#
# Runs Tome's release gates in order, fail-fast, from the repo root. A non-zero
# exit on any HARD gate means: do not deploy. The painting-URL check is SOFT
# (network-dependent) and only warns.
#
# Usage:
#   bash .claude/skills/tome-deploy/scripts/preflight.sh           # full gate (incl. build)
#   bash .claude/skills/tome-deploy/scripts/preflight.sh --no-build # skip next build
#   bash .claude/skills/tome-deploy/scripts/preflight.sh --no-urls  # skip painting-URL check
#
# Exit codes: 0 = all hard gates passed; non-zero = the first failing gate.

set -euo pipefail

# Resolve repo root from this script's location (.claude/skills/tome-deploy/scripts).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
cd "$ROOT"

RUN_BUILD=1
RUN_URLS=1
for arg in "$@"; do
  case "$arg" in
    --no-build) RUN_BUILD=0 ;;
    --no-urls)  RUN_URLS=0 ;;
    *) echo "unknown flag: $arg" >&2; exit 2 ;;
  esac
done

# Pick a package runner: prefer pnpm (repo convention), fall back to npm.
if command -v pnpm >/dev/null 2>&1; then
  PM=pnpm
elif command -v npm >/dev/null 2>&1; then
  PM=npm
else
  echo "ERROR: neither pnpm nor npm found on PATH" >&2
  exit 2
fi

step() { printf '\n\033[1m=== %s ===\033[0m\n' "$1"; }
ok()   { printf '\033[32m✓ %s\033[0m\n' "$1"; }
warn() { printf '\033[33m! %s\033[0m\n' "$1"; }

echo "tome-deploy preflight — repo: $ROOT (runner: $PM)"

# 1. Stoa invariant (also enforced by prebuild/CI). HARD.
step "1/6 audit:stoa --strict"
$PM audit:stoa --strict
ok "stoa invariant holds"

# 2. Achievements validation. HARD.
step "2/6 validate:achievements"
$PM validate:achievements
ok "achievements valid"

# 3. Painting URL liveness. SOFT (network-dependent) — warn, don't abort.
if [ "$RUN_URLS" -eq 1 ]; then
  step "3/6 verify-all-urls (soft)"
  if npx tsx scripts/verify-all-urls.mjs 2>/dev/null || node scripts/verify-all-urls.mjs; then
    ok "painting URLs verified"
  else
    warn "painting URL check failed or flaky — review manifest.json before shipping (non-blocking)"
  fi
else
  warn "3/6 painting URL check skipped (--no-urls)"
fi

# 4. Typecheck. HARD.
step "4/6 tsc --noEmit"
npx tsc --noEmit
ok "typecheck clean"

# 5. Lint. HARD.
step "5/6 lint"
$PM run lint
ok "lint clean"

# 6. Build (re-runs stoa audit via prebuild). HARD.
if [ "$RUN_BUILD" -eq 1 ]; then
  step "6/6 build"
  $PM run build
  ok "build succeeded"
else
  warn "6/6 build skipped (--no-build) — Vercel will still run it; a green local build is recommended before promoting"
fi

printf '\n\033[32m✓ preflight passed — gates green, clear to proceed to migrations/deploy\033[0m\n'
