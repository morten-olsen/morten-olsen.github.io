import { createCanvas } from 'canvas';
import { Generator } from '../types';
import { generators } from './types';

const mimeToExt = {
  'image/jpeg': 'jpg',
}

export const generateImage: Generator = async (data, location) => {
  const { type, output, ...rest } = data;
  const canvas = createCanvas(data.width, data.height)
  const generator = generators[type];
  await generator(rest, location, canvas);
  const ext = mimeToExt[output] || 'png';
  return {
    url: {
      name: `img.${ext}`,
      content: canvas.toBuffer(output),
    }
  };
}
