# vmhq

Blog personal minimalista. Reflexiones sobre tecnología e inteligencia artificial como herramientas al servicio de las personas.

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

Los posts son archivos Markdown individuales organizados por año y mes:

```
posts/2026/marzo/ia_colega_silencioso_14_03.md
```

Cada archivo usa frontmatter YAML:

```markdown
---
title: La IA como colega silencioso
slug: ia-colega-silencioso
date: 2026-03-14
time: 03:25:00   # opcional, recomendado si publicas más de un post el mismo día
---
Contenido en Markdown...
```

Notas sobre frontmatter:
- El `title` no necesita comillas, incluso si contiene dos puntos (`:`). El parser usa el primer `:` como separador clave-valor y toma el resto como valor.
- El orden del blog se define por `date` y, si existe, también por `time` (más reciente primero).

Para publicar un nuevo post, basta con crear el archivo `.md` en la carpeta correspondiente y hacer build. El sistema lo recoge automáticamente.

## Imágenes en posts

Los posts soportan imágenes en Markdown.

### Convención recomendada

Guardar imágenes locales en:

```bash
public/images/posts/
```

Y referenciarlas así dentro del post:

```md
![Descripción](/images/posts/nombre-imagen.png)
```

También se pueden usar imágenes remotas:

```md
![Captura](https://example.com/imagen.jpg)
```

### Nota práctica

- Preferir imágenes locales para contenido propio del blog
- Usar nombres de archivo simples, en minúsculas y con guiones
- Si un post usa varias imágenes, puedes agruparlas con prefijos o subcarpetas dentro de `public/images/posts/`

## Favicon

El favicon es un SVG minimalista con una "V" estilizada que se adapta automáticamente al tema del sistema operativo usando `@media (prefers-color-scheme: dark)` embebido en el SVG:

- **Light mode**: trazo `#222`
- **Dark mode**: trazo `#ccc`

El `index.html` referencia `favicon.svg` como primario y `favicon.ico` como fallback.

## Page Titles

El título de cada página se establece con `document.title` via `useEffect` como mecanismo principal, ya que `react-helmet-async` no siempre sobreescribe el `<title>` estático del `index.html`. El Helmet se mantiene para los meta tags de SEO/OG.

Formato: `{Título del post} — vmhq` en posts, `vmhq` en el index.

## Vercel

El proyecto está configurado para desplegar con **Bun** en Vercel:

- `installCommand`: `bun install`
- `buildCommand`: `bun run build`
- `outputDirectory`: `dist`
- SPA rewrite a `index.html` para rutas del blog

Además, el proyecto incluye:
- **Vercel Analytics** para tráfico y páginas vistas
- **Vercel Speed Insights** para métricas reales de rendimiento

## Features

- **Syntax highlighting** — bloques de código con colores por lenguaje (light/dark), usando `rehype-highlight` con tokens integrados en las CSS variables del blog
- **Botón de copiar** — overlay al hacer hover sobre cualquier bloque de código, copia al portapapeles con feedback visual
- **Navegación prev/next** — al final de cada post, enlaces al post anterior (más antiguo) y siguiente (más reciente)

## Build-Time Generation

El script `prebuild` corre antes de cada build y genera:
- `public/rss.xml` — RSS 2.0 feed (a partir de los archivos `.md`)
- `public/sitemap.xml` — XML sitemap

El `SITE_URL` se resuelve dinámicamente desde las variables de entorno de Vercel (`VERCEL_PROJECT_PRODUCTION_URL` o `VERCEL_URL`), sin dominio hardcodeado. Fallback a `localhost:8080` para desarrollo local.

El RSS incluye un bloque `<image>` apuntando al favicon SVG del sitio.

## License

MIT
