import { LatexGenerator } from "./Generator";
import { article } from './article';
import { resume } from './resume';

const generators: {[name: string]: LatexGenerator} = {
  article,
  resume,
};

export { generators };
