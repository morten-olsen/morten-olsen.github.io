import image from './me.jpg?as=url';

const levels = ['Beginner', 'Novice', 'Trained', 'Expert', 'Expert'];

export const languages = [
  {
    name: 'English',
    fluency: 'Conversational'
  },
  {
    name: 'Dansih',
    fluency: 'Native speaker'
  }
];

export const skills = [
  {
    name: 'Web Development (React)',
    level: levels[5],
    keywords: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Fastify']
  },
  {
    name: 'Mobile development (React Native)',
    level: levels[4],
    keywords: ['TypeScript', 'React Native', 'Expo', 'React Navigation']
  },
  {
    name: 'DevOps',
    level: levels[3],
    keywords: ['Docker', 'Terraform', 'GitHub Actions', 'AWS']
  }
];

export const basics = {
  name: 'Morten Olsen',
  label: 'Software Engineer',
  image,
  email: 'fbtijfdq@void.black',
  url: 'https://mortenolsen.pro',
  summary: "Hi, I'm Morten and I make software",
  location: {
    city: 'Copenhagen',
    countryCode: 'DK',
    region: 'Capital Region of Denmark'
  },
  profiles: [
    {
      network: 'GitHub',
      username: 'morten-olsen',
      url: 'https://github.com/morten-olsen'
    },
    {
      network: 'LinkedIn',
      username: 'mortenolsendk',
      url: 'https://www.linkedin.com/in/mortenolsendk/'
    }
  ]
};
