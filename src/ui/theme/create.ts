import chroma from 'chroma-js';
import { Theme } from './theme';

const WHITE = chroma('white');
const BLACK = chroma('black');

type CreateOptions = {
  baseColor?: string;
};

const isBright = (color: chroma.Color) => color.luminance() > 0.4;

const createTheme = (options: CreateOptions = {}) => {
  const baseColor = options.baseColor
    ? chroma(options.baseColor)
    : chroma.random();
  const text = isBright(baseColor) ? BLACK : WHITE;
  const bg = isBright(baseColor)
    ? baseColor.luminance(0.9)
    : baseColor.luminance(0.01);
  const theme: Theme = {
    typography: {
      Jumbo: {
        weight: 'bold',
        size: 2.8,
      },
      Title1: {
        weight: 'bold',
      },
      Title2: {
        weight: 'bold',
        size: 1.3,
      },
      Body1: {},
      Overline: {
        size: 0.8,
        upperCase: true,
      },
      Caption: {
        size: 0.8,
      },
      Link: {
        upperCase: true,
        weight: 'bold',
      },
    },
    colors: {
      primary: baseColor.hex(),
      foreground: text.hex(),
      background: bg.hex(),
    },
    font: {
      baseSize: 16,
    },
  };
  return theme;
};

export { createTheme };

