import { defineCollection, z } from 'astro:content';

import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: "**/index.mdx", base: "./src/content/posts" }),
  schema: ({ image }) => z.object({
    slug: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    color: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    heroImage: image(),
  })
});

const experiences = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/experiences" }),
  schema: ({ image }) => z.object({
    slug: z.string(),
    company: z.object({
      name: z.string(),
      url: z.string().url().optional(),
    }),
    position: z.object({
      name: z.string(),
      team: z.string().optional(),
    }),
    summary: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    logo: image().optional(),
    banner: image().optional(),
    stack: z.array(z.string()).optional(),
  })
});

const skills = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/skills" }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    technologies: z.array(z.string()),
  })
});

const collections = { posts, experiences, skills };

export { collections };
