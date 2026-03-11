# CLAUDE.md — minimalist-musings

A minimal blog built with **Vite + React + TypeScript + Tailwind CSS + shadcn/ui**.
Content is in Spanish; code and identifiers are in English.

## Commands

```bash
npm run dev          # Dev server on port 8080
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
npm run lint         # ESLint
npm run test         # Run all tests once (Vitest)
npm run test:watch   # Tests in watch mode
npx vitest run src/path/to/file.test.ts          # Single file
npx vitest run --testNamePattern="pattern"       # By name
```

## Project structure

```
src/
  components/     # React components
    ui/           # shadcn/ui — do NOT edit directly
  pages/          # Route-level pages (Index, PostPage, About, RSSFeed, NotFound)
  lib/            # Data (posts.ts) and utilities (utils.ts, theme.ts)
  hooks/          # Custom React hooks
  test/           # Vitest setup and test files
```

## Routes

| Path | Component |
|---|---|
| `/` | `Index` — paginated post list |
| `/post/:slug` | `PostPage` — individual post |
| `/about` | `About` |
| `/rss.xml` | `RSSFeed` |

## Content

Posts live as plain objects in `src/lib/posts.ts`. Each post has `{ slug, title, date, content }` where `content` is a Markdown string. To add a post, append an entry to the `posts` array; `getAllPosts()` sorts by date descending automatically.

## Code style

- `.tsx` for components, `.ts` for utilities.
- Path alias `@/*` maps to `src/*` — always use it.
- Class merging via `cn()` from `@/lib/utils`.
- No arbitrary Tailwind values (`w-[100px]` is forbidden).
- CSS variables for theming: `bg-background`, `text-muted-foreground`, etc.
- `React.forwardRef` + `displayName` for reusable UI primitives.
- `cva` for variant-based components.
- Prefer early returns over nested conditionals.

## Naming

| Thing | Convention |
|---|---|
| Components | `PascalCase` |
| Hooks | `camelCase` prefixed `use` |
| Utilities | `camelCase` |
| Files (multi-word) | `kebab-case` |
| Types / Interfaces | `PascalCase` |

## Testing

- Framework: **Vitest** + **jsdom**.
- Test files: `src/**/*.{test,spec}.{ts,tsx}`.
- Setup: `src/test/setup.ts`.
- Component tests: `@testing-library/react` + `@testing-library/jest-dom`.

## shadcn/ui

Add components with `npx shadcn add <component>`.
Never modify files under `src/components/ui/` — create wrappers in `src/components/` instead.

## Theme

Light/dark mode is managed in `BlogLayout` via `src/lib/theme.ts`.
Theme preference is persisted in `localStorage` under the key `"theme"` and respects `prefers-color-scheme` when no preference is stored.
