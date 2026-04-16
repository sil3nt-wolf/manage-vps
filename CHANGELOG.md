# Changelog

All notable changes to WOLF TECH VPS MANAGER are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] — 2025-04-17

Major rebrand and infrastructure upgrade from XCASPER MANAGER to **WOLF TECH VPS MANAGER**.

### Changed

- Complete rebrand to WOLF TECH — new name, logo, colour palette, and domain
- Theme overhauled: neon green `#00ff00` primary, pure black backgrounds, Orbitron (headings) + JetBrains Mono (code/terminal) fonts replacing the old purple/cyan xcasper.space palette
- Custom SVG favicon: glowing neon-green angular "W" on black with corner accent dots
- GitHub repo moved to [sil3nt-wolf/manage-vps](https://github.com/sil3nt-wolf/manage-vps)
- Live instance deployed at [manage-vps.xwolf.space](https://manage-vps.xwolf.space) via Cloudflare + nginx + PM2
- Updated all documentation to reflect WOLF TECH branding

### Added

- PostgreSQL + Drizzle ORM for session and data storage
- `/api/settings/rotate-key` endpoint to rotate the API key from within the app
- Settings page with API key rotation and server info
- Deploy automation scripts: `artifacts/vps-manager/deploy/setup.sh` (first-time VPS setup) and `deploy/update.sh` (git pull + rebuild + PM2 restart)
- Cloudflare real IP forwarding in nginx config
- nginx configured as `default_server` on port 443 to prevent other vhosts from intercepting traffic

### Infrastructure

- Hosted on Debian 13 VPS (AMD EPYC, 4 cores, 7.8 GB RAM)
- nginx 1.26 reverse proxy, PM2 process manager, PostgreSQL 17
- HTTPS via Cloudflare proxy (free SSL, no cert management needed on origin)

---

## [1.0.0] — 2025-12-01

Initial public release as XCASPER MANAGER.

### Added

#### Authentication
- API-key login page (`/login`) with show/hide password toggle
- `sessionStorage`-based token auto-injected as `Bearer` header on all API requests
- `GET /api/auth/verify` — validates the supplied API key
- `POST /api/auth/logout` — clears the client session
- `requireApiKey` middleware applied to all protected routes

#### Navigation & Layout
- Fixed top navbar with logo, route links (Home, Files, Terminal, Dev), social icon links, user avatar, and logout button
- Responsive mobile drawer menu
- All unknown routes redirect unauthenticated users to `/login`

#### System Dashboard (`/`)
- Real-time system info: CPU load + model, memory (used/free/total), root disk usage, uptime
- Load-average display (1 m / 5 m / 15 m)
- Disk usage table, network interface list, OS and kernel details
- Search bar navigating to `/files?search=<query>`
- "Clear Cache" button — `sync` + drop Linux page cache

#### File Manager (`/files`)
- Full filesystem browsing from any absolute path
- File type auto-detection: images, video, audio, syntax-highlighted code, plain text, binary
- In-browser text editor with save
- Create, delete, rename, move files and directories

#### Terminal (`/terminal`)
- In-browser shell with persistent working directory across commands

#### Dev Page (`/dev`)
- Live GitHub repo card, fork walkthrough, support links

### Tech Stack

- **Frontend**: React 18, Vite, TypeScript 5.9, TanStack Query, Wouter, Tailwind CSS, shadcn/ui
- **Backend**: Express 5, TypeScript, esbuild (ESM bundle)
- **Validation**: Zod v4 (generated from OpenAPI 3.1 spec via Orval)
- **Monorepo**: pnpm workspaces, Node.js 22

---

[2.0.0]: https://github.com/sil3nt-wolf/manage-vps/releases/tag/v2.0.0
[1.0.0]: https://github.com/sil3nt-wolf/manage-vps/releases/tag/v1.0.0
