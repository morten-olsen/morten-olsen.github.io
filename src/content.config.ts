import { defineCollection, z } from 'astro:content';

import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: "**/index.md", base: "./src/content/posts" }),
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
    audio: z.string().optional(),
    published: z.boolean().optional(),
  })
});

const experiences = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/experiences" }),
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
  loader: glob({ pattern: "**/*.md", base: "./src/content/skills" }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    technologies: z.array(z.string()),
  })
});

const projects = defineCollection({
  loader: glob({ pattern: "**/index.md", base: "./src/content/projects" }),
  schema: ({ image }) => z.object({
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    repo: z.string().url(),
    url: z.string().url().optional(),
    heroImage: image().optional(),
    stack: z.array(z.string()),
    license: z.string().optional(),
    status: z.enum(['active', 'alpha', 'archived']).optional(),
  })
});

const collections = { posts, experiences, skills, projects };

export { collections };
