import { createFile } from '../file';
import ejs from 'ejs';

const createEjs = (path: string) => {
  const file = createFile({ path });
  const template = file.pipe(async (tmpl) => {
    const compiled = ejs.compile(tmpl.toString());
    return compiled;
  });
  return template;
};

export { createEjs };
