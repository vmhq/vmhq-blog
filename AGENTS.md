# Agent Guidelines for vmhq-blog

## Project Overview

A minimal blog built with Bun + Vite 8 + React 19 + TypeScript + Tailwind CSS 4. Content is in Spanish, code in English. `README.md` must be written entirely in English — no Spanish mixed in.

## Build & Development Commands

```bash
# Install dependencies
bun install

# Development server (runs on port 8080)
bun run dev

# Production build
bun run build

# Development build
bun run build:dev

# Preview production build
bun run preview

# Linting
bun run lint

# Run all tests once
bun run test

# Run tests in watch mode
bun run test:watch

# Run a single test file
bunx vitest run src/path/to/file.test.ts

# Run tests matching a pattern
bunx vitest run --testNamePattern="pattern"
```

## Project Structure

```
posts/             # Seed-only Markdown posts (copied into DATA_DIR on first boot, not read at runtime)
public/images/posts/  # Seed-only images for those posts
public/favicon.svg    # Adaptive SVG favicon (dark/light via prefers-color-scheme)
src/
  components/       # React components
    ui/            # shadcn/ui components (do not modify directly)
  pages/           # Route-level page components
  lib/             # Utility functions and data (posts.ts fetches from the API at runtime)
  hooks/           # Custom React hooks
  test/            # Test files and setup.ts
api/
  handler.ts        # Posts API routing (GET/POST /api/posts, /rss.xml, /sitemap.xml)
  storage.ts         # Filesystem writes to DATA_DIR
  posts-repo.ts       # Loads/parses posts from DATA_DIR
  seed.ts             # One-time bootstrap of DATA_DIR from posts/ + public/images/posts/
scripts/
  generate-feeds.ts   # Legacy build-time RSS + sitemap from the git-tracked posts/ seed (SITE_URL from process.env)
```

## Critical Conventions

### UTF-8 in JSX

Always use literal UTF-8 characters in JSX text content:

```tsx
// CORRECT
<p>La tecnología y la inteligencia artificial</p>

// WRONG — renders as literal backslash sequences
<p>La tecnolog\u00eda y la inteligencia artificial</p>
```

Unicode escapes like `\u2014` are fine inside JS string expressions (e.g. `document.title = "Acerca \u2014 vmhq"`).

For the em dash specifically: use `\u2014` escape only inside JS strings (e.g. `document.title`), but use the literal `—` character inside JSX `<title>` tags.

### Page Titles

Set `document.title` via `useEffect` as the primary mechanism. `react-helmet-async` does not reliably override the static `<title>` from `index.html`.

```tsx
const pageTitle = post ? `${post.title} \u2014 vmhq` : "vmhq";

useEffect(() => {
  document.title = pageTitle;
}, [pageTitle]);
```

Keep `<Helmet><title>` in sync for SEO meta tags.

### Frontmatter

Post titles do **not** need quotes, even with colons:

```md
---
title: La IA como colega silencioso: automatización al servicio del juicio profesional
slug: ia-colega-silencioso
date: 2026-03-14
time: 03:25:00
---
```

The parser splits on the first `:` only.

### SITE_URL

`scripts/generate-feeds.ts` reads `SITE_URL` from `process.env.SITE_URL` with a fallback to `https://blog.vmhq.cl`. Set it as an environment variable in the deployment environment.

### RSS Feed

- Generation logic is shared in `src/lib/feeds.ts` (`generateRSS`, `generateSitemap`)
- `scripts/generate-feeds.ts` runs as a `prebuild` step and writes static files from the seed `posts/` — only relevant outside Docker
- `api/handler.ts` serves `GET /rss.xml` / `GET /sitemap.xml` dynamically from `DATA_DIR`, proxied by nginx in Docker; this is what production actually serves
- The RSS feed includes a `<image>` block pointing to `/favicon.svg`, `<lastBuildDate>`, and `<atom:link rel="self">`.

## Code Style Guidelines

### TypeScript

- Use `.tsx` for components, `.ts` for utilities
- ES modules only (`"type": "module"`)
- Strict TypeScript is enabled (`strict: true` in `tsconfig.app.json`)
- Use interfaces for component props and data models
- Prefer explicit return types on exported functions

### Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `BlogLayout.tsx`)
- **Hooks**: camelCase starting with `use` (`use-mobile.tsx`)
- **Utilities**: camelCase (`cn`, `getAllPosts`)
- **Files**: kebab-case for multi-word (`use-mobile.tsx`)
- **Types/Interfaces**: PascalCase (`ButtonProps`, `Post`)

### Imports

```typescript
// React namespace import (required pattern)
import * as React from "react";

// Type imports
import type { VariantProps } from "class-variance-authority";

// Path aliases (ALWAYS use these)
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Third-party imports
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
```

> **Note:** Hooks must be accessed via the React namespace (e.g. `React.useState`, `React.useEffect`) when using the namespace import pattern.

### Component Patterns

```typescript
// Use cva for variant-based components
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", secondary: "..." },
    size: { default: "...", sm: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});

// Forward ref pattern with displayName
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";
```

### Styling with Tailwind

- Use `cn()` utility from `@/lib/utils` for class merging
- Never use arbitrary values (e.g., `w-[100px]`)
- Use CSS variables for theming: `bg-primary`, `text-muted-foreground`
- Theme uses HSL values in CSS variables
- Tailwind CSS v4 is configured CSS-first via `@theme` in `src/index.css` (no `tailwind.config.ts`)

### Error Handling

- Prefer early returns over nested conditionals
- Optional chaining for potentially undefined values
- No try-catch required for simple operations

## Testing

- Framework: Vitest with jsdom
- Test files: `src/**/*.test.ts` or `src/**/*.spec.ts`
- Setup file: `src/test/setup.ts`
- Use `@testing-library/react` for component tests
- Use `@testing-library/jest-dom` for assertions

## Linting Rules

- ESLint with typescript-eslint
- React hooks rules enforced
- Unused vars allowed (disabled rule)
- React refresh: only export components, constants allowed

## shadcn/ui Guidelines

- Use `bunx shadcn add <component>` to add new components
- Do not modify files in `src/components/ui/` directly
- Create wrapper components in `src/components/` if customization needed

## Path Aliases

Always use path aliases (configured in `tsconfig.json` and `vite.config.ts`):
- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/lib/*` → `src/lib/*`
- `@/hooks/*` → `src/hooks/*`

## Before Finishing Work

Always run, when relevant:

```bash
bun run test
bun run build
```

If you touch content or feed generation, include updated:
- `public/rss.xml`
- `public/sitemap.xml`
