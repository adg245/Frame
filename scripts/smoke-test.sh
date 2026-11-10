#!/usr/bin/env bash
#
# Quick smoke test for a deployed (or local) FRAME backend.
# Hits public endpoints only — anything requiring auth is covered by the
# manual pass in TESTING.md instead, since it needs a real signed-in session.
#
# Usage:
#   ./scripts/smoke-test.sh                        # defaults to http://localhost:3001
#   ./scripts/smoke-test.sh https://your-backend.onrender.com

set -uo pipefail

BASE_URL="${1:-http://localhost:3001}"
PASS=0
FAIL=0

check() {
  local description="$1"
  local path="$2"
  local expected_status="$3"

  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${path}")

  if [ "$status" = "$expected_status" ]; then
    echo "  ✓ $description (got $status)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $description — expected $expected_status, got $status"
    FAIL=$((FAIL + 1))
  fi
}

echo "Running smoke test against: $BASE_URL"
echo ""

echo "Health & config:"
check "GET /api/health responds"              "/api/health"           200

echo ""
echo "Public movie endpoints (require TMDB configured):"
check "GET /api/movies/trending"               "/api/movies/trending"  200
check "GET /api/movies/popular"                "/api/movies/popular"   200
check "GET /api/movies/genres"                 "/api/movies/genres"    200

echo ""
echo "Auth-gated endpoints correctly reject anonymous requests:"
check "GET /api/profile without a token → 401" "/api/profile"          401
check "GET /api/watchlist without a token → 401" "/api/watchlist"      401
check "GET /api/collections without a token → 401" "/api/collections" 401
check "GET /api/history without a token → 401" "/api/history"         401

echo ""
echo "Unknown route:"
check "GET /api/does-not-exist → 404"          "/api/does-not-exist"   404

echo ""
echo "──────────────────────────────"
echo "Passed: $PASS   Failed: $FAIL"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
