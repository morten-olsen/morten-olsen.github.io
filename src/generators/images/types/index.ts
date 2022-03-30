import { ImageGenerator } from "./types";
import { shareGenerator } from "./share";
import { resizeGenerator } from "./resize";

const generators: {[name: string]: ImageGenerator} = {
  share: shareGenerator,
  resize: resizeGenerator,
};

export { generators };
