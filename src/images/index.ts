import { createCanvas } from 'canvas';
import yaml from 'yaml';
import { generators } from './generator';

export const generateImage = async (source: string, location: string) => {
  const definition = yaml.parse(source);
  const canvas = createCanvas(definition.width * 2, definition.height * 2)
  const generator = generators[definition.generator];
  await generator(definition.data, location, canvas);
  return canvas;
}
