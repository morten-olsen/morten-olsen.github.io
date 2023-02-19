import { imageLoader } from "./image";
import { markdownLoader } from "./markdown";
import { reactLoader } from "./react";
import { scriptLoader } from "./script";

const loaders = {
  react: reactLoader,
  script: scriptLoader,
  image: imageLoader,
  markdown: markdownLoader,
};

export { loaders };
