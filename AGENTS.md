# Agent Guidelines for vmhq-blog

## Project Overview

A minimal blog built with Bun + Vite 8 + React 19 + TypeScript + Tailwind CSS 4. Content is in Spanish, code in English.

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
posts/             # Markdown posts
public/images/posts/  # Local images referenced from Markdown posts
src/
  components/       # React components
    ui/            # shadcn/ui components (do not modify directly)
  pages/           # Route-level page components
  lib/             # Utility functions and data
  hooks/           # Custom React hooks
  test/            # Test files and setup.ts
```

## Code Style Guidelines

### TypeScript

- Use `.tsx` for components, `.ts` for utilities
- ES modules only (`"type": "module"`)
- Strict TypeScript is disabled (`noImplicitAny: false`)
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
