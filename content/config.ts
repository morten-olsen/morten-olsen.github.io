import { Config } from '../types/config';

const config: Config = {
  profile: {
    path: 'profile.yml',
  },
  frontpage: {
    react: {
      template: 'templates/react/pages/frontpage/index.tsx',
    },
  },
  resume: {
    latex: {
      template: 'templates/latex/resume.tex',
    },
  },
  articles: {
    pattern: 'articles/**/*.md',
    react: {
      template: 'templates/react/pages/article/index.tsx',
    },
    latex: {
      template: 'templates/latex/article.tex',
    },
  },
  positions: {
    pattern: 'resume/positions/**/*.md',
  },
};

export default config;
