import { defineCollection, z } from 'astro:content'

const articles = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      color: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).optional(),
      heroImage: image().refine((img) => img.width >= 320, {
        message: 'Cover image must be at least 1080 pixels wide!'
      })
    })
})

const work = defineCollection({
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      position: z.string(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      summary: z.string().optional(),
      url: z.string().optional(),
      logo: image()
        .refine((img) => img.width >= 200, {
          message: 'Logo must be at least 320 pixels wide!'
        })
        .optional(),
      banner: image()
        .refine((img) => img.height >= 50, {
          message: 'Logo must be at least 320 pixels wide!'
        })
        .optional()
    })
})

const references = defineCollection({
  schema: () =>
    z.object({
      name: z.string(),
      position: z.string(),
      company: z.string(),
      date: z.coerce.date(),
      relation: z.string(),
      profile: z.string()
    })
})

const skills = defineCollection({
  schema: () =>
    z.object({
      name: z.string(),
      technologies: z.array(z.string())
    })
})

export const collections = { articles, work, references, skills }
