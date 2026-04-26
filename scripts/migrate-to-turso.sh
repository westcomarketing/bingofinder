#!/bin/bash
# migrate-to-turso.sh
# Run this ONCE after creating your Turso database to push all 1,001 bingo halls.
#
# Usage:
#   TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... bash scripts/migrate-to-turso.sh

set -e

if [ -z "$TURSO_DATABASE_URL" ] || [ -z "$TURSO_AUTH_TOKEN" ]; then
  echo "ERROR: Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN before running this script."
  echo ""
  echo "Get these from: turso db show bingofinder --url  and  turso db tokens create bingofinder"
  exit 1
fi

echo "Pushing schema to Turso..."
DATABASE_URL="$TURSO_DATABASE_URL" npx prisma db push --skip-generate

echo "Migrating data from local dev.db to Turso..."
# Export data from local SQLite and import into Turso via the Prisma seed approach
TURSO_DATABASE_URL="$TURSO_DATABASE_URL" TURSO_AUTH_TOKEN="$TURSO_AUTH_TOKEN" npx tsx scripts/seed-turso.ts

echo ""
echo "Done! Your Turso database is populated."
echo ""
echo "Add these to Cloudflare Pages environment variables:"
echo "  TURSO_DATABASE_URL = $TURSO_DATABASE_URL"
echo "  TURSO_AUTH_TOKEN   = (your token)"
