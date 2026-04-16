# WOLF TECH VPS MANAGER

[![License: MIT](https://img.shields.io/badge/License-MIT-00ff00.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-lightgrey.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Live](https://img.shields.io/badge/Live-manage--vps.xwolf.space-00ff00.svg)](https://manage-vps.xwolf.space)

**A self-hosted, browser-based VPS file manager and control panel** — built and maintained by [WOLF TECH](https://xwolf.space).

> *Full control of your server. From any browser. No SaaS. No subscriptions. No telemetry.*

Deploy it on your own server, secure it with your own API key, and manage your filesystem from anywhere.

> [!IMPORTANT]
> **You must set `API_KEY` in your `.env` file before running the app.**
> This is the key you enter on the login screen. Without it, the server will refuse all requests.
> See [Quick Start → Create a `.env` file](#3-create-a-env-file) below.

---

## Live Instance

**[https://manage-vps.xwolf.space](https://manage-vps.xwolf.space)**

Hosted on a Debian 13 VPS, served via nginx + PM2, secured with Cloudflare proxy (HTTPS).

---

## Screenshot

![WOLF TECH VPS MANAGER — System Dashboard](docs/screenshot-dashboard.png)

---

## Features

| Category | Capability |
|---|---|
| **File Management** | Browse, create, edit, rename, move, delete files and directories (including `/root`) |
| **File Viewer** | Images, video, audio, syntax-highlighted code, plain text — auto-detected by extension |
| **Terminal** | In-browser shell with persistent working directory (`cd` across commands) |
| **System Dashboard** | Real-time CPU (with model), memory (used/free/total), disk, network stats and uptime |
| **PM2 Panel** | Start, stop, restart, and monitor PM2 processes right from the browser |
| **Search** | Filename filter from the home page or directly via `?search=` URL param |
| **Clear Cache** | `sync` + drop Linux page cache (root) or sync-only (non-root) |
| **Authentication** | API-key login; Bearer token auto-injected into all requests via `sessionStorage` |
| **Settings** | Rotate API key, view server info, manage session from within the app |
| **Dev Page** | Developer info, live GitHub repo card, fork walkthrough, support links |
| **Theming** | WOLF TECH neon-green hacker aesthetic — `#00ff00` primary, pure black background, Orbitron + JetBrains Mono fonts |

---

## Quick Start

### Requirements

- Node.js 20+ (tested on 22)
- pnpm 9+
- PM2 (for production)
- PostgreSQL (for session storage)

### 1. Clone

```bash
git clone https://github.com/sil3nt-wolf/manage-vps.git
cd manage-vps
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Create a `.env` file

> [!WARNING]
> **Never commit `.env` to version control.** It is already in `.gitignore`.

Create a file named `.env` in the **project root**:

```env
# ── Required ────────────────────────────────────────────────────────────────
# The key you type on the login screen. Make it long and random.
# You can rotate it later from the Settings page inside the app.
API_KEY=your-secret-key-here

# Session encryption secret — any long random string works
SESSION_SECRET=any-random-string-here

# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/wolfvps
```

> **Tip:** generate a strong key with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 4. Push the database schema

```bash
pnpm --filter @workspace/db run db:push
```

### 5. Development

```bash
# Start API server
pnpm --filter @workspace/api-server run dev &

# Start frontend dev server
pnpm --filter @workspace/vps-manager run dev
```

Open `http://localhost:5173` and sign in with your `API_KEY`.

---

## Deployment

### Automated (recommended)

Use the included deploy scripts:

```bash
# First-time setup on a fresh VPS
bash artifacts/vps-manager/deploy/setup.sh

# Pull latest changes and restart
bash artifacts/vps-manager/deploy/update.sh
```

### Manual

#### 1. Build for production

```bash
pnpm run build
```

> **Note:** If your VPS has less than 2 GB free RAM, build the frontend locally and upload the `dist/` folder via `scp` or `rsync` — the Vite build can OOM on low-memory servers.

#### 2. Start with PM2

```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup   # register for auto-restart on reboot
```

#### 3. Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Serve the React frontend (static build)
    root /path/to/manage-vps/artifacts/vps-manager/dist/public;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Express
    location /api/ {
        proxy_pass http://127.0.0.1:8082;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4. PM2 script reference

| Script | Command | What it does |
|--------|---------|-------------|
| `pm2:start` | `pnpm run pm2:start` | Build + start the API process |
| `pm2:stop` | `pnpm run pm2:stop` | Stop the API process |
| `pm2:restart` | `pnpm run pm2:restart` | Hard restart |
| `pm2:reload` | `pnpm run pm2:reload` | Zero-downtime reload |
| `pm2:logs` | `pnpm run pm2:logs` | Tail live logs |
| `pm2:status` | `pnpm run pm2:status` | Show all PM2 process statuses |
| `pm2:save` | `pnpm run pm2:save` | Save process list for auto-restart |
| `pm2:startup` | `pnpm run pm2:startup` | Generate systemd startup hook |
| `pm2:delete` | `pnpm run pm2:delete` | Remove process from PM2 list |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, TanStack Query, Wouter, Tailwind CSS |
| **Backend** | Express 5, TypeScript, esbuild (ESM bundle) |
| **Database** | PostgreSQL 17, Drizzle ORM |
| **Process Manager** | PM2 |
| **Reverse Proxy** | nginx |
| **CDN / SSL** | Cloudflare (proxy + free HTTPS) |
| **Validation** | Zod v4 |
| **Monorepo** | pnpm workspaces |
| **Fonts** | Orbitron (headings), JetBrains Mono (code/terminal) |

---

## Project Structure

```
manage-vps/
├── artifacts/
│   ├── api-server/          # Express 5 REST API
│   │   └── src/             # Routes, middleware, system/file/PM2 handlers
│   └── vps-manager/         # React + Vite frontend
│       ├── src/pages/       # Home, Files, Terminal, Dev, Settings
│       ├── public/          # favicon.svg
│       └── deploy/          # setup.sh + update.sh automation scripts
├── lib/
│   ├── api-spec/            # OpenAPI 3.1 spec + Orval codegen config
│   ├── api-client-react/    # Generated React Query hooks
│   ├── api-zod/             # Generated Zod schemas
│   └── db/                  # Drizzle ORM schema + migrations
├── ecosystem.config.cjs     # PM2 process config
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
└── SECURITY.md
```

---

## API Reference

All endpoints are prefixed with `/api` and require `Authorization: Bearer <API_KEY>`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/auth/verify` | Validate API key |
| `POST` | `/auth/logout` | Clear session |
| `GET` | `/system/info` | CPU, memory, disk, network, uptime |
| `POST` | `/system/clear-cache` | sync + drop page cache |
| `GET` | `/files/list?path=` | List directory contents |
| `GET` | `/files/read?path=` | Read file content (max 5 MB) |
| `GET` | `/files/raw?path=` | Stream raw file bytes |
| `POST` | `/files/write` | Write or create a file |
| `DELETE` | `/files/delete?path=` | Delete file or directory |
| `POST` | `/files/mkdir` | Create directory |
| `POST` | `/files/rename` | Rename or move |
| `POST` | `/terminal/exec` | Execute a shell command |
| `GET` | `/pm2/list` | List all PM2 processes |
| `POST` | `/pm2/:name/restart` | Restart a PM2 process |
| `POST` | `/pm2/:name/stop` | Stop a PM2 process |
| `POST` | `/settings/rotate-key` | Rotate the API key |

---

## Links

- **Live App**: [manage-vps.xwolf.space](https://manage-vps.xwolf.space)
- **GitHub**: [github.com/sil3nt-wolf/manage-vps](https://github.com/sil3nt-wolf/manage-vps)
- **WOLF TECH**: [xwolf.space](https://xwolf.space)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the fork workflow, branch naming, and PR checklist.

## Security

See [SECURITY.md](SECURITY.md) for responsible disclosure instructions.

## License

[MIT](LICENSE) — Copyright 2025 WOLF TECH / sil3nt-wolf
