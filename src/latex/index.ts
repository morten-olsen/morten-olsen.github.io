import { generators } from "./generators";
import yaml from 'yaml';
import path from 'path';

const generateLatex = async (source: string, location: string) => {
  const definition = yaml.parse(source);
  const generator = generators[definition.generator];
  const latex = await generator(definition.data, location);
  return latex;
}

export { generateLatex };
