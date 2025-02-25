import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { resolve } from 'path'

const base = import.meta.dirname

const articles = defineCollection({
  loader: glob({ pattern: '*/index.mdx', base: resolve(base, 'articles') }),
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      title: z.string(),
      description: z.string(),
      color: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).optional(),
      heroImage: image()
    })
})

const work = defineCollection({
  loader: glob({ pattern: '*.mdx', base: resolve(base, 'work') }),
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      name: z.string(),
      position: z.string(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      summary: z.string().optional(),
      url: z.string().optional(),
      logo: image().optional(),
      banner: image().optional()
    })
})

const references = defineCollection({
  loader: glob({ pattern: '*.mdx', base: resolve(base, 'references') }),
  schema: () =>
    z.object({
      slug: z.string(),
      name: z.string(),
      position: z.string(),
      company: z.string(),
      date: z.coerce.date(),
      relation: z.string(),
      profile: z.string()
    })
})

const skills = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/skills' }),
  schema: () =>
    z.object({
      slug: z.string(),
      name: z.string(),
      technologies: z.array(z.string())
    })
})

export const collections = { articles, work, references, skills }
