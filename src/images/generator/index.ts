import { ImageGenerator } from "./Generator";
import { shareGenerator } from "./share";

const generators: {[name: string]: ImageGenerator} = {
  share: shareGenerator,
};

export { generators };
