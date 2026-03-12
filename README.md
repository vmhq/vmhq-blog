# vmhq — Reflexiones Minimalistas

A minimalist personal blog built with Vite, React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Vite** — build tool and dev server
- **React 18** — UI library with StrictMode enabled
- **TypeScript** — strict mode
- **Tailwind CSS** — utility-first styling
- **react-helmet-async** — per-page SEO meta tags
- **react-markdown** + remark-gfm — Markdown rendering
- **Vitest** — unit testing

## Getting Started

```sh
npm install
npm run dev
```

The dev server starts at `http://localhost:8080`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Generate RSS/sitemap, then production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
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

## Build-Time Generation

The `prebuild` script runs before each build to generate:
- `public/rss.xml` — RSS 2.0 feed
- `public/sitemap.xml` — XML sitemap

## License

MIT
