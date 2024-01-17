import image from './me2.jpg';

const levels = ['Beginner', 'Novice', 'Trained', 'Expert', 'Expert'];

const languages = [
  {
    name: 'English',
    fluency: 'Conversational'
  },
  {
    name: 'Danish',
    fluency: 'Native speaker'
  }
];

const skills = [
  {
    name: 'Web Development',
    level: levels[5],
    keywords: ['TypeScript', 'React', 'RTK', 'React Query', 'Vite', 'Webpack', 'Next.js', 'Astro']
  },
  {
    name: 'Mobile development',
    level: levels[4],
    keywords: ['TypeScript', 'React Native', 'Expo', 'React Navigation', 'Xamarin']
  },
  {
    name: 'Service development',
    level: levels[4],
    keywords: ['TypeScript', 'Node.js', 'Fastify', 'tRPC', 'Apollo', 'Knex.js', '.Net', 'Rust']
  },
  {
    name: 'DevOps',
    level: levels[3],
    keywords: ['Kubernetes', 'Docker', 'ArgoCD', 'Terraform', 'GitHub Actions', 'AWS']
  }
];

const basics = {
  name: 'Morten Olsen',
  label: 'Software Engineer',
  image,
  email: 'fbtijfdq@void.black',
  url: 'https://mortenolsen.pro',
  summary: "Hi, I'm Morten and I make software 👋",
  location: {
    city: 'Copenhagen',
    countryCode: 'DK',
    region: 'Capital Region of Denmark'
  },
  profiles: [
    {
      network: 'GitHub',
      username: 'morten-olsen',
      icon: 'devicon:github',
      url: 'https://github.com/morten-olsen'
    },
    {
      network: 'LinkedIn',
      username: 'mortenolsendk',
      icon: 'devicon:linkedin',
      url: 'https://www.linkedin.com/in/mortenolsendk/'
    }
  ]
};

export { basics, languages, skills };

