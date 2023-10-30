import chroma from 'chroma-js';
import { BASE_COLOR } from '../consts';

type Theme = {
  color?: string;
  fonts?: {
    header?: string;
    body?: string;
  };
}

const createTheme = (theme: Theme) => {
  const { color = BASE_COLOR } = theme;

  let textColor: string | undefined;

  let bgColor: string | undefined;

  if (color) {
    const isBright = (color: chroma.Color) => color.luminance() > 0.4;

    const baseColor = chroma(color);

    textColor = isBright(baseColor) ? 'black' : 'white';
    bgColor = isBright(baseColor)
      ? baseColor.luminance(0.9).hex()
      : baseColor.luminance(0.01).hex();
  }

  return {
    '--primary': color,
    '--primary-alt': textColor,
    '--fg': textColor,
    '--bg': bgColor,
  };
};

export type { Theme };
export { createTheme };
