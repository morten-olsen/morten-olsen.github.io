import { Generator } from "./types";
import { generateImage } from "./images";
import { generateLatex } from "./latex";
import { generateHtmlImage } from "./html-to-image";

type Options = {
  definition: {
    generator: string;
    data: any;
  },
  isDev: boolean;
  location: string;
  addDependency: (file: string) => void;
};
const generators: {[name: string]: Generator} = {
  image: generateImage,
  latex: generateLatex,
  'html-image': generateHtmlImage,
}
const generate = async ({
  definition,
  location,
  isDev,
  addDependency,
}: Options) => {
  const { data, generator } = definition;
  const generatorFn = generators[generator];
  const result = await generatorFn({
    data,
    location,
    isDev,
    addDependency,
  });
  return result;
};

export { generate };
