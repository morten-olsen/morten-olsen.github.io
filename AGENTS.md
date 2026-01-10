# Agent Guidelines for this Repository

> **Important**: This file is the source of truth for all agents working in this repository. If you modify the build process, add new tools, change the architecture, or introduce new conventions, **you must update this file** to reflect those changes.

## 1. Project Overview & Commands

This is an **Astro** project using **pnpm**.

### Build & Run Commands
- **Install Dependencies**: `pnpm install`
- **Development Server**: `pnpm dev`
- **Build for Production**: `pnpm build` (Output: `dist/`)
- **Preview Production Build**: `pnpm preview`
- **Check Types**: `npx tsc --noEmit` (since `strict` is enabled)

### Testing & Linting
- **Linting**: No explicit lint command found in `package.json`. Follow existing code style strictly.
- **Testing**: No explicit test framework (Jest/Vitest) is currently configured.
  - *If asked to add tests*: Verify if a test runner needs to be installed first.

## 2. Directory Structure

```text
/
├── public/             # Static assets
├── src/
│   ├── assets/         # Source assets (processed by Astro)
│   ├── components/     # Astro components
│   │   ├── base/       # UI Primitives
│   │   └── page/       # Layout-specific components (Header, Footer)
│   ├── content/        # Markdown/MDX content collections
│   │   ├── posts/
│   │   ├── experiences/
│   │   └── skills/
│   ├── data/           # Data access layer (Classes & Utilities)
│   ├── layouts/        # Page layouts (if any)
│   ├── pages/          # File-based routing
│   ├── styles/         # Global styles (if any)
│   └── utils/          # Helper functions
├── astro.config.ts     # Astro configuration
├── package.json        # Dependencies & Scripts
└── tsconfig.json       # TypeScript configuration
```

## 3. Code Style & Conventions

### General Formatting
- **Indentation**: 2 spaces.
- **Semicolons**: **Preferred**. While mixed in some older files, new code should use semicolons.
- **Quotes**: 
  - **Code**: Single quotes `'string'`.
  - **Imports**: Double quotes `"package"` or single quotes `'./file'` (mixed, generally follow file context).
  - **JSX/Attributes**: Double quotes `<Component prop="value" />`.
- **Line Endings**: LF.

### TypeScript & JavaScript
- **Strictness**: `strictNullChecks` is enabled via `astro/tsconfigs/strict`.
- **Path Aliases**: 
  - Use `~/` to refer to `src/` (e.g., `import { data } from '~/data/data'`).
- **Naming**:
  - Components/Classes: `PascalCase` (e.g., `Header.astro`, `Posts`).
  - Variables/Functions: `camelCase` (e.g., `getPublished`).
  - Constants: `camelCase` or `UPPER_CASE`.
  - Private Fields: Use JS private fields `#field` over TypeScript `private` keyword where possible.
- **Error Handling**: Use `try...catch` or explicit checks (e.g., `if (!entry) throw new Error(...)`).

### Astro Components (.astro)
- **Structure**:
  ```astro
  ---
  // Imports
  import { Picture } from "astro:assets";
  import { data } from "~/data/data";
  
  // Logic (Top-level await supported)
  const { title } = Astro.props;
  const posts = await data.posts.getPublished();
  ---
  <!-- Template -->
  <div class="container">
    <h1>{title}</h1>
    {posts.map(post => <a href={post.slug}>{post.data.title}</a>)}
  </div>

  <style>
    /* Scoped CSS */
    .container { 
      max-width: var(--content-width); 
    }
    /* Nesting is supported and encouraged */
    .parent { 
      .child { color: red; } 
    }
  </style>
  ```
- **Images**: Use `<Picture />` from `astro:assets` for optimized images.
- **CSS**: 
  - Use scoped `<style>` blocks at the bottom of the file.
  - **Variables**: Use CSS variables for theming (e.g., `var(--content-width)`, `var(--t-fg)`).

## 4. Architecture & Patterns

### Data Access Layer (`src/data/`)
The project uses a dedicated data access layer instead of querying collections directly in components.

- **Pattern**: 
  - Data logic is encapsulated in classes (e.g., `class Posts`).
  - These classes wrap `getCollection` and `getEntry` from `astro:content`.
  - They provide helper methods like `getPublished()`, sorting, and mapping.
  - **Export**: A central `data` object aggregates all services.

**Example (`src/data/data.posts.ts`):**
```typescript
import { getCollection } from "astro:content";

class Posts {
  // Private mapper for transforming raw entries
  #map = (post) => {
    return { ...post, derivedProp: '...' };
  }

  public getPublished = async () => {
    const collection = await getCollection('posts');
    return collection
      .map(this.#map)
      .sort((a, b) => b.data.pubDate - a.data.pubDate);
  }
}

export const posts = new Posts();
```

**Usage:**
```typescript
import { data } from "~/data/data";
const posts = await data.posts.getPublished();
```

### Content Collections (`src/content/`)
- Defined in `src/content.config.ts`.
- Uses `zod` for schema validation.
- Loaders: Uses `glob` loader.
- Current Collections: `posts`, `experiences`, `skills`.

## 5. Environment & Configuration
- **Package Manager**: `pnpm`
- **Config**: `astro.config.ts` handles integrations (MDX, Sitemap, Icon, etc.).
- **TS Config**: `tsconfig.json` extends `astro/tsconfigs/strict`.

## 6. Dependencies
- **Core**: `astro`, `@astrojs/mdx`, `astro-icon`.
- **Styling**: Standard CSS (scoped), `less` is in devDependencies.
- **Assets**: `@fontsource/vt323` (font), `sharp` (image processing).
