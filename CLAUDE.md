# CLAUDE.md

## Project Overview

`vmhq-blog` is a minimalist personal blog built with:
- **Bun**
- **React 19**
- **Vite 8**
- **TypeScript 5.9**
- **Tailwind CSS 4**
- **Vitest 4**

Content is written in **Spanish**. Code, config, and technical docs stay in **English**. `README.md` must be written entirely in English — no Spanish mixed in.

## Working Rules

- Use **Bun** for package management and scripts.
- Do not reintroduce `npm`, `package-lock.json`, or `autoprefixer`.
- Keep the blog visually minimal and readable.
- Be conservative with visual changes: preserve typography, spacing, and dark-mode readability.
- Prefer small, surgical edits over broad refactors.
- **Always use literal UTF-8 characters** in JSX and string content (e.g. `tecnología`, `cómo`). Never use Unicode escape sequences (`\u00f3`, `\u00e9`, etc.) in JSX text — they render as literal backslash sequences.
- For the em dash in page titles, use the `\u2014` escape only inside JS strings (e.g. `document.title`), but use the literal `—` character inside JSX `<title>` tags.

## Commands

```bash
# Install
bun install

# Dev server
bun run dev

# Tests
bun run test

# Tests in watch mode
bun run test:watch

# Run a single test file
bunx vitest run src/path/to/file.test.ts

# Run tests matching a pattern
bunx vitest run --testNamePattern="pattern"

# Production build
bun run build

# Development build
bun run build:dev

# Preview production build
bun run preview

# Lint
bun run lint
```

## Content Model

Posts are **not** read from git at runtime. The frontend fetches them from the Posts API (`GET /api/posts`) at runtime — see `src/lib/posts.ts` (`usePosts()` hook) — and the API reads/writes them from `DATA_DIR` on local disk (`./data` locally, a Docker named volume in production). Never reintroduce `import.meta.glob` over `posts/` in `src/lib/posts.ts`.

`posts/YYYY/mes/*.md` and `public/images/posts/` in this repo are a **frozen seed only**: `api/server.ts` copies them into `DATA_DIR` the first time it starts against an empty data dir (`api/seed.ts`), then never touches them again. Do not expect edits to these folders to show up on a running site — publish through `POST /api/posts` instead. Layout inside `DATA_DIR` mirrors the repo layout: `DATA_DIR/posts/YYYY/mes/*.md` and `DATA_DIR/images/posts/`.

Each post uses frontmatter:

```md
---
title: Título del post
slug: titulo-del-post
date: 2026-03-14
time: 03:25:00   # optional, recommended for ordering posts from the same day
---
```

Frontmatter notes:
- The `title` does **not** need quotes, even if it contains colons (`:`). The parser splits on the first `:` only.
- Do not move posts back into hardcoded arrays or inline TS content.

Reference post images from Markdown like:

```md
![Texto alternativo](/images/posts/archivo.jpg)
```

In Docker, `/images/posts/` is served by nginx straight from the shared `posts_data` volume (`nginx.conf`, `location ^~ /images/posts/`), not from the static build.

## Page Titles

Each page sets `document.title` via `useEffect` as the primary mechanism. `react-helmet-async` does **not** reliably override the static `<title>` from `index.html` in this SPA setup.

Keep `<Helmet><title>` in sync for SEO/OG meta tags, but always include the `useEffect` as the source of truth for the browser tab.

Format: `{Post title} — vmhq` for posts, `Acerca — vmhq` for about, `vmhq` for index.

## Build / Feed Notes

- RSS/sitemap XML generation lives in `src/lib/feeds.ts` (`generateRSS`, `generateSitemap`), shared by two callers:
  - `scripts/generate-feeds.ts` — `prebuild` step, writes static `public/rss.xml`/`public/sitemap.xml` from the git-tracked `posts/` seed. Only relevant outside Docker (e.g. Vercel); in Docker these files are shadowed by nginx routing `/rss.xml` and `/sitemap.xml` to the API instead.
  - `api/handler.ts` — serves `GET /rss.xml` and `GET /sitemap.xml` on demand from `DATA_DIR`, so feeds reflect posts published via the API immediately.
- `SITE_URL` is read from `process.env.SITE_URL` in both places — no hardcoded domain in code.
- The RSS feed includes an `<image>` block pointing to `/favicon.svg`

## Favicon

The favicon is an adaptive SVG (`public/favicon.svg`) with `@media (prefers-color-scheme: dark)` embedded. Light: `#222` stroke. Dark: `#ccc` stroke. `favicon.ico` is kept as fallback for older browsers.

## Styling Notes

- Tailwind 4 is enabled CSS-first via `@import "tailwindcss";` in `src/index.css` — there is no `tailwind.config.ts`
- PostCSS uses `@tailwindcss/postcss`
- Theme tokens are CSS variables in `src/index.css`
- Dark mode uses the `dark` class and must remain readable
- Never use arbitrary values (e.g., `w-[100px]`) — use theme tokens instead
- Use `cn()` from `@/lib/utils` for class merging

## shadcn/ui

- Add new components with `bunx shadcn add <component>`
- Do **not** modify files in `src/components/ui/` directly
- Create wrapper components in `src/components/` if customization is needed

## Posts API (standalone Bun server)

`api/server.ts` is a self-hosted HTTP API (plain `Bun.serve`, zero external dependencies, no cloud provider, no GitHub token) so AI agents can publish posts without cloning the repo:

- `GET /api/posts` — public, no auth. Returns all posts as JSON (parsed, sorted newest-first) — this is what the frontend fetches at runtime (`src/lib/posts.ts`).
- `POST /api/posts` — `multipart/form-data` with `title`, `content` (Markdown body, no frontmatter), optional `slug`, `date`, `time`, and repeatable `images` file parts. Auth: `Authorization: Bearer <BLOG_API_TOKEN>`.
- `GET /api/health` — unauthenticated health check.
- `GET /rss.xml` / `GET /sitemap.xml` — generated on demand from `DATA_DIR`.
- `GET /images/posts/<file>` — serves post images from `DATA_DIR/images/posts`. Only used locally, where `vite.config.ts` proxies `/images/posts` here for dev parity with the `bun run dev` flow; in Docker nginx serves this path straight from the volume instead (see `nginx.conf`).
- Publishing writes the post straight to `DATA_DIR/posts/YYYY/<mes>/<slug con guiones bajos>_DD_MM.md` and images to `DATA_DIR/images/posts/<slug>-<archivo>` on local disk. No git commit, no rebuild — the post is live immediately.
- Layout: `api/handler.ts` (portable fetch handler + routing), `api/publish.ts` (pure validation/path-building logic, tested in `api/publish.test.ts`), `api/storage.ts` (filesystem writes, path-traversal guarded), `api/posts-repo.ts` (loads/parses posts from `DATA_DIR` for `GET /api/posts` and the feeds), `api/seed.ts` (one-time bootstrap from seed dirs), `api/server.ts` (Bun entry).
- Run locally: `bun run api`. Docker: service `api` in `docker-compose.yml` (`Dockerfile.api`), not exposed on the host directly — reachable via `blog`'s nginx proxy at `/api/` on port 9845, or as `api:8787` on the Compose network. Has a `healthcheck` hitting `GET /api/health` via `bun`'s own `fetch` (no `curl`/`wget` in the alpine image); `blog` depends on `api` with `condition: service_healthy`.
- Config via env vars (see `.env.example`): required `BLOG_API_TOKEN` (bearer token); optional `DATA_DIR` (defaults `./data` locally, `/data` in Docker), `SITE_URL`, `PORT`.
- `posts_data` is a Docker named volume shared read-write with `api` and read-only with `blog` (mounted at `/data` in both). It is the durable store for everything published after the initial seed — it is not backed up to git. See README's Docker section for a volume backup command.

## Before Finishing Work

Always run, when relevant:

```bash
bun run test
bun run build
```

If you touch content or feed generation, include updated:
- `public/rss.xml`
- `public/sitemap.xml`
