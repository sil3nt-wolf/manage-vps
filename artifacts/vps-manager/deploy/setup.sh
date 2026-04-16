#!/bin/bash
# ============================================================
#  WOLF TECH VPS MANAGER — Server Deploy Script
#  Run as root on a fresh Ubuntu 22.04 / Debian 12 VPS
#  Usage: bash setup.sh
# ============================================================
set -e

# ── CONFIG — edit these ──────────────────────────────────────
DOMAIN="your-subdomain.yourdomain.com"   # e.g. manage.wolftech.dev
GITHUB_REPO="https://github.com/sil3nt-wolf/manage-vps"
APP_DIR="/opt/wolf-vps"
API_KEY="change-this-to-a-strong-secret"
SESSION_SECRET="change-this-to-another-strong-secret"
DB_PASSWORD="change-this-db-password"
DB_NAME="wolfvps"
DB_USER="wolfvps"
# ─────────────────────────────────────────────────────────────

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   WOLF TECH VPS MANAGER — INSTALLER      ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── 1. System packages ───────────────────────────────────────
echo "[1/8] Updating system and installing dependencies..."
apt-get update -qq
apt-get install -y -qq curl git nginx certbot python3-certbot-nginx postgresql postgresql-contrib ufw

# ── 2. Node.js 22 via nvm ────────────────────────────────────
echo "[2/8] Installing Node.js 22..."
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y -qq nodejs
fi
node --version

# pnpm
if ! command -v pnpm &>/dev/null; then
  npm install -g pnpm@latest
fi
pnpm --version

# PM2
if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
fi
pm2 --version

# ── 3. PostgreSQL ────────────────────────────────────────────
echo "[3/8] Setting up PostgreSQL..."
systemctl start postgresql
systemctl enable postgresql

sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null || true

DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"

# ── 4. Clone & build ─────────────────────────────────────────
echo "[4/8] Cloning and building app..."
rm -rf "$APP_DIR"
git clone "$GITHUB_REPO" "$APP_DIR"
cd "$APP_DIR"

# Write environment file
cat > .env << EOF
DATABASE_URL=$DATABASE_URL
SESSION_SECRET=$SESSION_SECRET
API_KEY=$API_KEY
NODE_ENV=production
EOF

# Install dependencies
pnpm install --frozen-lockfile

# Build API server
pnpm --filter @workspace/api-server run build

# Build frontend (static files)
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/vps-manager run build --mode production

# Push DB schema
pnpm --filter @workspace/api-server run db:push 2>/dev/null || \
  npx --prefix artifacts/api-server drizzle-kit push 2>/dev/null || true

echo "[4/8] Build complete."

# ── 5. PM2 process manager ───────────────────────────────────
echo "[5/8] Configuring PM2..."
cat > "$APP_DIR/ecosystem.config.cjs" << EOF
module.exports = {
  apps: [
    {
      name: "wolf-api",
      script: "./artifacts/api-server/dist/index.mjs",
      cwd: "$APP_DIR",
      env: {
        NODE_ENV: "production",
        PORT: "8080",
        DATABASE_URL: "$DATABASE_URL",
        SESSION_SECRET: "$SESSION_SECRET",
        API_KEY: "$API_KEY"
      },
      node_args: "--enable-source-maps",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M"
    }
  ]
};
EOF

pm2 delete wolf-api 2>/dev/null || true
pm2 start "$APP_DIR/ecosystem.config.cjs"
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash || true

echo "[5/8] PM2 running."

# ── 6. Nginx config ──────────────────────────────────────────
echo "[6/8] Configuring Nginx..."
cat > /etc/nginx/sites-available/wolf-vps << EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Frontend — serve Vite static build
    root $APP_DIR/artifacts/vps-manager/dist/public;
    index index.html;

    # API — proxy to Express
    location /api/ {
        proxy_pass         http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        proxy_read_timeout 120s;
    }

    # SPA fallback — all unknown routes → index.html
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
EOF

ln -sf /etc/nginx/sites-available/wolf-vps /etc/nginx/sites-enabled/wolf-vps
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "[6/8] Nginx configured."

# ── 7. SSL with Let's Encrypt ────────────────────────────────
echo "[7/8] Obtaining SSL certificate..."
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email admin@"$DOMAIN" --redirect 2>/dev/null || \
  echo "  ⚠ SSL skipped — run manually: certbot --nginx -d $DOMAIN"

# ── 8. Firewall ──────────────────────────────────────────────
echo "[8/8] Configuring firewall..."
ufw allow OpenSSH
ufw allow "Nginx Full"
ufw --force enable

# ── Done ─────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║        INSTALLATION COMPLETE!            ║"
echo "╠══════════════════════════════════════════╣"
echo "║  URL:  https://$DOMAIN"
echo "║  API:  http://127.0.0.1:8080"
echo "║  PM2:  pm2 status"
echo "║  Logs: pm2 logs wolf-api"
echo "╚══════════════════════════════════════════╝"
echo ""
