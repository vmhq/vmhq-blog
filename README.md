# vmhq — Reflexiones Minimalistas

A minimalist personal blog built with Bun, React 19, Vite 8, TypeScript, and Tailwind CSS 4.

## Tech Stack

- **Bun 1.x** — package manager and runtime
- **Vite 8** — build tool and dev server
- **React 19** — UI library with StrictMode enabled
- **TypeScript 5.9** — strict mode
- **Tailwind CSS 4** — utility-first styling
- **react-helmet-async** — per-page SEO meta tags
- **react-markdown** + remark-gfm — Markdown rendering
- **Vitest 4** — unit testing
- **Vercel Analytics** — privacy-friendly page analytics
- **Vercel Speed Insights** — real-user performance metrics

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
    └── mes/
        └── nombre_del_post_DD_MM.md   # Posts en Markdown
src/
├── components/     # Reusable components (BlogLayout)
├── lib/            # Utilities (posts, formatters, theme, utils)
├── pages/          # Route pages (Index, PostPage, About, NotFound)
├── test/           # Test files
├── App.tsx         # Router setup
├── main.tsx        # Entry point
└── index.css       # Global styles and CSS variables
scripts/
└── generate-feeds.ts   # Build-time RSS and sitemap generation
```

## Posts

Los posts son archivos Markdown individuales organizados por año y mes:

```
posts/2026/marzo/sobre_la_simplicidad_10_03.md
```

Cada archivo usa frontmatter YAML:

```markdown
---
title: Título del post
slug: titulo-del-post
date: 2026-03-10
---
Contenido en Markdown...
```

Para publicar un nuevo post, basta con crear el archivo `.md` en la carpeta correspondiente y hacer build. El sistema lo recoge automáticamente.

## Vercel

El proyecto está configurado para desplegar con **Bun** en Vercel:

- `installCommand`: `bun install`
- `buildCommand`: `bun run build`
- `outputDirectory`: `dist`
- SPA rewrite a `index.html` para rutas del blog

Además, el proyecto incluye:
- **Vercel Analytics** para tráfico y páginas vistas
- **Vercel Speed Insights** para métricas reales de rendimiento

No fue necesario cambiar más archivos para el despliegue: `vercel.json` ya quedó alineado con Bun + Vite.

## Build-Time Generation

El script `prebuild` corre antes de cada build y genera:
- `public/rss.xml` — RSS 2.0 feed (a partir de los archivos `.md`)
- `public/sitemap.xml` — XML sitemap

## License

MIT
