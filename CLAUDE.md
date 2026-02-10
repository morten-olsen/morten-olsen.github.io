# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

**Build Commands:**
```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (http://localhost:4321)
pnpm build            # Production build (outputs to dist/)
pnpm preview          # Preview production build
npx tsc --noEmit      # Type check
```

No linting or test framework is configured.

## Project Overview

Personal portfolio/blog built with **Astro 5** and **pnpm**. Content is authored in MDX with TypeScript throughout.

## Key Architecture Pattern

**Data Access Layer** - Content is never queried directly in components. Instead, use the centralized data services:

```typescript
import { data } from "~/data/data";

const posts = await data.posts.getPublished();
const experience = await data.experiences.get('company-name');
const skills = await data.skills.getAll();
```

Data classes in `src/data/` wrap Astro's `getCollection`/`getEntry` and add derived properties (reading time, sorting, filtering).

## Content Collections

Defined in `src/content.config.ts`:
- **posts** - Blog articles (`src/content/posts/**/index.mdx`)
- **experiences** - Work history (`src/content/experiences/**/*.mdx`)
- **skills** - Technical skills (`src/content/skills/**/*.mdx`)

## Code Conventions

- **Path alias**: `~/` maps to `src/`
- **Strict TypeScript**: Enabled via `astro/tsconfigs/strict`
- **Private fields**: Use `#field` syntax
- **Images**: Use `<Picture />` from `astro:assets`
- **Styling**: Scoped `<style>` blocks with CSS nesting, use CSS variables (`var(--content-width)`, `var(--t-fg)`)

## Detailed Guidelines

See **AGENTS.md** for comprehensive conventions, code style details, and component structure examples.
