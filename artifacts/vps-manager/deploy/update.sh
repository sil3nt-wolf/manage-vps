#!/bin/bash
# ============================================================
#  WOLF TECH VPS MANAGER — Update Script
#  Run from /opt/wolf-vps to pull latest code and redeploy
# ============================================================
set -e

APP_DIR="/opt/wolf-vps"
cd "$APP_DIR"

echo "[1/4] Pulling latest code..."
git pull origin main

echo "[2/4] Installing dependencies..."
pnpm install --frozen-lockfile

echo "[3/4] Rebuilding..."
pnpm --filter @workspace/api-server run build
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/vps-manager run build --mode production

echo "[4/4] Restarting API..."
pm2 restart wolf-api
pm2 save

echo ""
echo "✓ Update complete — $(date)"
pm2 status
