#!/bin/bash
# Uptime monitor for Pelaminan wedding SaaS
# Checks health endpoint and sends Telegram alert on failure
# Designed to run every 5 minutes via cron

set -euo pipefail

HEALTH_URL="http://localhost:4000/health"
FRONTEND_URL="http://localhost:3000"
TELEGRAM_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-955169177}"
STATE_FILE="/tmp/pelaminan_uptime_state"

send_alert() {
  local msg="$1"
  if [ -n "$TELEGRAM_TOKEN" ]; then
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
      -d chat_id="$TELEGRAM_CHAT_ID" \
      -d text="$msg" \
      -d parse_mode="Markdown" > /dev/null
  else
    echo "$msg"
  fi
}

check_service() {
  local name="$1"
  local url="$2"
  local http_code

  http_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 "$url" 2>/dev/null || echo "000")

  if [ "$http_code" = "200" ]; then
    echo "OK"
  else
    echo "FAIL:$http_code"
  fi
}

# Check services
backend_status=$(check_service "backend" "$HEALTH_URL")
frontend_status=$(check_service "frontend" "$FRONTEND_URL")

# Read previous state
prev_state=$(cat "$STATE_FILE" 2>/dev/null || echo "OK")

current_state="OK"
failed_services=""

if [ "$backend_status" != "OK" ]; then
  current_state="FAIL"
  failed_services="${failed_services}• Backend: ${backend_status}\n"
fi

if [ "$frontend_status" != "OK" ]; then
  current_state="FAIL"
  failed_services="${failed_services}• Frontend: ${frontend_status}\n"
fi

# Alert on state change
if [ "$current_state" = "FAIL" ] && [ "$prev_state" = "OK" ]; then
  # Service just went down
  send_alert "🚨 *Pelaminan DOWN*%0A%0A${failed_services}%0ATime: $(date '+%Y-%m-%d %H:%M:%S WIB')"
  echo "FAIL" > "$STATE_FILE"

elif [ "$current_state" = "OK" ] && [ "$prev_state" = "FAIL" ]; then
  # Service recovered
  send_alert "✅ *Pelaminan RECOVERED*%0A%0AAll services back online.%0ATime: $(date '+%Y-%m-%d %H:%M:%S WIB')"
  echo "OK" > "$STATE_FILE"

else
  # No state change — update state silently
  echo "$current_state" > "$STATE_FILE"
fi
