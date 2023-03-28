import { resolve } from 'path';
import { Config } from '../../types/config';
import { createEjs } from '../resources/ejs';
import { createReact } from '../resources/react';

const getTemplates = (cwd: string, config: Config) => ({
  latex: {
    article: createEjs(resolve(cwd, config.articles.latex.template)),
    resume: createEjs(resolve(cwd, config.resume.latex.template)),
  },
  react: {
    article: createReact(resolve(cwd, config.articles.react.template)),
    frontpage: createReact(resolve(cwd, config.frontpage.react.template)),
  },
});

export { getTemplates };
