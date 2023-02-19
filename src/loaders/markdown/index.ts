import sharp from "sharp";
import { Loader } from "../../bundler";
import { replaceImages } from "./utils";

type Options = {
  cwd: string;
  content: string;
  imageFormat?: keyof sharp.FormatEnum;
};

type Output = Promise<string>;

const markdownLoader = (options: Options): Loader<Output> => async ({
  bundler,
}) => {
  const result = await replaceImages(bundler, options);
  return result;
};

export { markdownLoader };
