#!/bin/bash
# Daily pg_dump backup for wedding_db
# Runs inside the postgres container via docker exec
# Keeps last 7 days of backups

set -euo pipefail

BACKUP_DIR="/home/ssm-user/wedding-invitation/backups"
DATE=$(date +%Y-%m-%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/wedding_${DATE}.sql.gz"
CONTAINER="wedding_postgres"
DB_USER="wedding"
DB_NAME="wedding"
KEEP_DAYS=7

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup..."
docker exec "$CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"

SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
echo "[$(date)] Backup complete: $BACKUP_FILE ($SIZE)"

# Prune old backups
find "$BACKUP_DIR" -name "wedding_*.sql.gz" -mtime +${KEEP_DAYS} -delete
echo "[$(date)] Pruned backups older than ${KEEP_DAYS} days"

# Send Telegram notification
TELEGRAM_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-955169177}"

if [ -n "$TELEGRAM_TOKEN" ]; then
  curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
    -d chat_id="$TELEGRAM_CHAT_ID" \
    -d text="✅ *Pelaminan DB Backup*%0ADate: ${DATE}%0ASize: ${SIZE}%0AFile: wedding_${DATE}.sql.gz" \
    -d parse_mode="Markdown" > /dev/null
fi
