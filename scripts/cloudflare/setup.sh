#!/usr/bin/env bash
set -euo pipefail

# Requires: CF_API_TOKEN, CF_ACCOUNT_ID, CF_ZONE_ID
# Optional: PRIMARY_DOMAIN (e.g., ruuley.com), WWW_DOMAIN (www.ruuley.com)

if [[ -z "${CF_API_TOKEN:-}" || -z "${CF_ACCOUNT_ID:-}" || -z "${CF_ZONE_ID:-}" ]]; then
  echo "CF_API_TOKEN, CF_ACCOUNT_ID, CF_ZONE_ID are required" >&2
  exit 1
fi

api() {
  local method="$1"; shift
  local path="$1"; shift
  curl -sS -X "$method" "https://api.cloudflare.com/client/v4$path" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" \
    "$@"
}

echo "Enable Always Use HTTPS"
api PATCH "/zones/$CF_ZONE_ID/settings/always_use_https" \
  --data '{"value":"on"}' | jq -r '.success'

echo "Enable HSTS (1 year, includeSubdomains, preload=false)"
api PATCH "/zones/$CF_ZONE_ID/settings/strict_transport_security" \
  --data '{"value":{"enabled":true,"max_age":31536000,"include_subdomains":true,"nosniff":true}}' | jq -r '.success'

echo "Enable Brotli and HTTP3 and Early Hints"
api PATCH "/zones/$CF_ZONE_ID/settings/brotli" --data '{"value":"on"}' | jq -r '.success'
api PATCH "/zones/$CF_ZONE_ID/settings/http3" --data '{"value":"on"}' | jq -r '.success'
api PATCH "/zones/$CF_ZONE_ID/settings/early_hints" --data '{"value":"on"}' | jq -r '.success'

echo "Block AI training bots (Managed Rule) — manual step may still be needed depending on plan"
# This typically requires WAF settings via rulesets API; leave as manual if not available on plan.

echo "Done. Review settings in dashboard."
