import { z } from 'astro:content';
import { frontmatter, Content } from '../content/profile/profile.md';
import image from '../content/profile/profile.jpg';
import type { ResumeSchema } from '~/types/resume-json';
import { positionWithTeam } from '~/utils/utils.format';

const schema = z.object({
  name: z.string(),
  tagline: z.string().optional(),
  role: z.string().optional(),
  url: z.string(),
  contact: z.object({
    email: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  location: z.object({
    city: z.string(),
    countryCode: z.string(),
  }),
  profiles: z.record(z.string(), z.object({
    network: z.object({
      name: z.string(),
    }).optional(),
    username: z.string().optional(),
    url: z.string(),
  })),
  image: z.object({
    src: z.string(),
    format: z.enum(["png", "jpg", "jpeg", "tiff", "webp", "gif", "svg", "avif"]),
    width: z.number(),
    height: z.number(),
  })
});


const data = schema.parse({
  ...frontmatter,
  image: image,
})
const profile = Object.assign(data, {
  Content,
  getJsonLd: async () => {
    const { experiences } = await import('./data.experiences');
    const currentExperience = await experiences.getCurrent();
    const previousExperiences = await experiences.getPrevious();
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      id: '#me',
      name: data.name,
      email: data.contact?.email,
      image: data.image.src,
      url: data.url,
      jobTitle: currentExperience?.data.position,
      contactPoint: Object.entries(data.profiles).map(([id, profile]) => ({
        '@type': 'ContactPoint',
        contactType: id,
        identifier: profile.username,
        url: profile.url
      })),
      address: {
        '@type': 'PostalAddress',
        addressLocality: data.location.city,
        // addressRegion: data.profile.basics.location.region,
        addressCountry: data.location.countryCode
      },
      sameAs: Object.values(data.profiles),
      hasOccupation: currentExperience && {
        '@type': 'EmployeeRole',
        roleName: currentExperience.data.position,
        startDate: currentExperience.data.startDate.toISOString()
      },
      worksFor: currentExperience && {
        '@type': 'Organization',
        name: currentExperience?.data.company.name,
        sameAs: currentExperience?.data.company.url
      },
      alumniOf: previousExperiences.map((w) => ({
        '@type': 'Organization',
        name: w.data.company.name,
        sameAs: w.data.company.url,
        employee: {
          '@type': 'Person',
          hasOccupation: {
            '@type': 'EmployeeRole',
            roleName: positionWithTeam(w.data.position.name, w.data.position.team),
            startDate: w.data.startDate.toISOString(),
            endDate: w.data.endDate?.toISOString()
          },
          sameAs: '#me'
        }
      }))
    }
  },
  getResumeJson: async (): Promise<ResumeSchema> => {
    const { experiences } = await import('./data.experiences');
    const { skills } = await import('./data.skills');
    const allExperiences = await experiences.getAll();
    const allSkills = await skills.getAll();
    return {
      basics: {
        name: data.name,
        label: data.role,
        image: data.image.src,
        email: data.contact?.email,
        phone: data.contact?.phone,
        url: data.url,
        location: data.location && {
          city: data.location.city,
          countryCode: data.location.countryCode,
        },
        profiles: Object.entries(data.profiles || {}).map(([id, profile]) => ({
          network: profile.network?.name || id,
          username: profile.username,
          url: profile.url,
        }))
      },
      work: allExperiences.map((experience) => ({
        name: experience.data.company.name,
        position: positionWithTeam(experience.data.position.name, experience.data.position.team),
        url: experience.data.company.url,
        startDate: experience.data.startDate.toISOString(),
        endDate: experience.data.endDate?.toISOString(),
      })),
      skills: allSkills.map((skill) => ({
        name: skill.data.name,
        keywords: skill.data.technologies,
      }))
    }
  }
});

export { profile };
