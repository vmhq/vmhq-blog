# vmhq

A minimalist personal blog. Reflections on technology and artificial intelligence as tools in service of people.

Built with Bun, React 19, Vite 8, TypeScript, and Tailwind CSS 4.

## Tech Stack

- **Bun 1.x** — package manager and runtime
- **Vite 8** — build tool and dev server
- **React 19** — UI library with StrictMode enabled
- **TypeScript 5.9** — strict mode
- **Tailwind CSS 4** — utility-first styling
- **react-helmet-async** — per-page SEO meta tags
- **react-markdown** + remark-gfm + rehype-highlight — Markdown rendering with syntax highlighting
- **Vitest 4** — unit testing

## Getting Started

```sh
bun install
bun run dev
```

The dev server starts at `http://localhost:8080`.

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start development server |
| `bun run build` | Generate RSS/sitemap, then production build |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Run ESLint |
| `bun run test` | Run tests |
| `bun run test:watch` | Run tests in watch mode |

## Project Structure

```
posts/
└── YYYY/
    └── month/
        └── post-name_DD_MM.md      # Markdown posts (content in Spanish)
src/
├── components/     # Reusable components (BlogLayout, CodeBlock)
├── lib/            # Utilities (posts, formatters, theme, utils)
├── pages/          # Route pages (Index, PostPage, About, NotFound)
├── test/           # Test files
├── App.tsx         # Router setup
├── main.tsx        # Entry point
└── index.css       # Global styles and CSS variables
scripts/
└── generate-feeds.ts   # Build-time RSS and sitemap generation
public/
└── favicon.svg         # Adaptive SVG favicon (dark/light)
```

## Posts

Posts are individual Markdown files organized by year and month:

```
posts/2026/marzo/ia_colega_silencioso_14_03.md
```

Each file uses YAML frontmatter:

```markdown
---
title: La IA como colega silencioso
slug: ia-colega-silencioso
date: 2026-03-14
time: 03:25:00   # optional, recommended when publishing multiple posts on the same day
---
Content in Markdown...
```

Frontmatter notes:
- `title` does not need quotes, even when it contains colons (`:`). The parser splits on the first `:` only.
- Posts are ordered by `date` and, when present, `time` (most recent first).

To publish a new post, create the `.md` file in the appropriate folder and run a build. The system picks it up automatically.

## Images in Posts

Posts support Markdown images.

### Recommended convention

Store local images under:

```bash
public/images/posts/
```

Reference them from within the post:

```md
![Alt text](/images/posts/image-name.png)
```

Remote images are also supported:

```md
![Screenshot](https://example.com/image.jpg)
```

### Practical notes

- Prefer local images for blog-owned content.
- Use simple, lowercase, hyphenated filenames.
- If a post uses multiple images, group them with prefixes or subdirectories inside `public/images/posts/`.

## Favicon

The favicon is a minimalist SVG with a stylized "V" that adapts automatically to the OS theme using `@media (prefers-color-scheme: dark)` embedded in the SVG:

- **Light mode**: `#222` stroke
- **Dark mode**: `#ccc` stroke

`index.html` references `favicon.svg` as primary and `favicon.ico` as fallback.

## Page Titles

Each page sets `document.title` via `useEffect` as the primary mechanism, since `react-helmet-async` does not reliably override the static `<title>` in `index.html`. The Helmet tag is kept for SEO/OG meta tags.

Format: `{Post title} — vmhq` for posts, `vmhq` for the index.

## Features

- **Syntax highlighting** — code blocks with per-language colors (light/dark), using `rehype-highlight` with tokens integrated into the blog's CSS variables
- **Copy button** — overlay on hover over any code block, copies to clipboard with visual feedback
- **Prev/next navigation** — at the end of each post, links to the previous (older) and next (newer) post

## Build-Time Generation

The `prebuild` script runs before every build and generates:
- `public/rss.xml` — RSS 2.0 feed (from `.md` files)
- `public/sitemap.xml` — XML sitemap

`SITE_URL` is resolved from `process.env.SITE_URL` (set in the deployment environment), with no hardcoded domain. Falls back to `localhost:8080` for local development.

The RSS feed includes an `<image>` block pointing to the site's SVG favicon.

## Posts API

`api/server.ts` is a standalone Bun HTTP server (no external dependencies, no cloud provider) that lets AI agents publish posts without cloning the repo. It commits Markdown posts and images straight to `main` via the GitHub Git Data API.

```sh
# Run locally
bun run api
```

Endpoints:

| Endpoint | Description |
|---|---|
| `POST /api/posts` | `multipart/form-data` with `title`, `content` (Markdown, no frontmatter), optional `slug`, `date`, `time`, and repeatable `images` file parts. Requires `Authorization: Bearer <BLOG_API_TOKEN>`. |
| `GET /api/health` | Unauthenticated health check. |

Configuration is via environment variables — copy `.env.example` to `.env`:

| Variable | Required | Description |
|---|---|---|
| `BLOG_API_TOKEN` | Yes | Bearer token AI agents must send. Generate with `openssl rand -hex 32`. |
| `GITHUB_TOKEN` | Yes | Fine-grained GitHub PAT with `contents:write` on this repo. |
| `GITHUB_REPO` | No | Defaults to `vmhq/vmhq-blog`. |
| `GITHUB_BRANCH` | No | Defaults to `main`. |
| `SITE_URL` | No | Defaults to `https://blog.vmhq.cl`. |
| `PORT` | No | Defaults to `8787`. |

## Docker

`docker-compose.yml` runs two services:

- **`blog`** — nginx serving the static production build, pulled from `ghcr.io/vmhq/vmhq-blog:latest` (built by `Dockerfile` and published by CI on every push to `main`). Exposed on host port `9845`.
- **`api`** — the Posts API, built locally from `Dockerfile.api`. Exposed on host port `9846`, reads its config from the environment variables above.

```sh
docker compose up -d
```

## License

MIT
