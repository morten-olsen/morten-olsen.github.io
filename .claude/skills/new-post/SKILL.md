---
name: new-post
description: Scaffolds a new blog post directory with frontmatter and assets folder. Use when starting a new article.
---

When the user wants to start a new blog post:

1. **Gather info.** You need at minimum: a working title and a topic. Ask for anything missing. Optionally ask about:
   - Target subtitle
   - Desired slug (or derive from title)
   - Accent color preference (or pick one that's distinct from recent posts)
   - Tags

2. **Check for color conflicts.** Read the frontmatter of the 5 most recent posts in `src/content/posts/` and pick a `color` that's visually distinct. Prefer vibrant, saturated hex colors.

3. **Create the directory and files:**
   - `src/content/posts/{slug}/index.mdx` — with frontmatter and starter content
   - `src/content/posts/{slug}/assets/` — empty directory for images

4. **Write starter frontmatter:**
```yaml
---
title: "The Title"
subtitle: "Optional subtitle"
description: "A conversational, benefit-focused description for previews and social cards"
pubDate: {today's date}
color: '{chosen hex color}'
heroImage: ./assets/cover.png
slug: {slug}
---
```

5. **Write a starter body** with the standard imports and a brief outline skeleton:
```mdx
import ContentImage from '~/components/content/ContentImage.astro'

{/* TODO: Add cover.png to ./assets/ */}

## [First Section]

## [Second Section]

## [Closing Section]
```

6. **Suggest next steps.** Tell the user:
   - They need a cover image at `./assets/cover.png`
   - They can use `/co-writer` to flesh out the draft
   - They can use the editor agent to review before publishing

Only import `BotMessage` if the post topic suggests it will be needed (AI/agent-related posts).
