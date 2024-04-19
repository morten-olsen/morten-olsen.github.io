import type { ResumeSchema } from '@/types/resume-schema.js'
import { Content } from './description.md'
import image from './profile.jpg'

const basics = {
  name: 'Morten Olsen',
  tagline: "Hi, I'm Morten and I make software 👋",
  email: 'fbtijfdq@void.black',
  url: 'https://mortenolsen.pro',
  image: image.src,
  location: {
    city: 'Copenhagen',
    countryCode: 'DK',
    region: 'Capital Region of Denmark'
  },
  profiles: [
    {
      network: 'GitHub',
      icon: 'mdi:github',
      username: 'morten-olsen',
      url: 'https://github.com/morten-olsen'
    },
    {
      network: 'LinkedIn',
      icon: 'mdi:linkedin',
      username: 'mortenolsendk',
      url: 'https://www.linkedin.com/in/mortenolsendk'
    }
  ],
  languages: [
    {
      name: 'English',
      fluency: 'Conversational'
    },
    {
      name: 'Danish',
      fluency: 'Native speaker'
    }
  ]
} satisfies ResumeSchema['basics']

const profile = {
  basics,
  image,
  Content
}

export { profile }
