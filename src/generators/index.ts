import { Generator } from "./types";
import { generateImage } from "./images";
import { generateLatex } from "./latex";

const generators: {[name: string]: Generator} = {
  image: generateImage,
  latex: generateLatex,
}
const generate = async (definition: any, location: string) => {
  const { data, generator } = definition;
  const generatorFn = generators[generator];
  const result = await generatorFn(data, location);
  return result;
};

export { generate };
