import { createHash } from "crypto";
import { Asset, Bundler } from "../../bundler";
import { Observable } from "../../observable";
import sharp, { FormatEnum } from "sharp";

type ImageOptions = {
  format: keyof FormatEnum;
  name?: string;
  image: string;
  width?: number;
  height?: number;
  bundler: Bundler;
};

const createImage = (options: ImageOptions) => {
  let path =
    options.name || createHash("sha256").update(options.image).digest("hex");
  if (options.width) {
    path += `-w${options.width}`;
  }
  if (options.height) {
    path += `-h${options.height}`;
  }
  path += `.${options.format}`;
  const loader = async () => {
    const item = sharp(options.image);
    if (options.width || options.height) {
      item.resize(options.width, options.height);
    }
    item.toFormat(options.format);
    const content = await item.toBuffer();
    return {
      content,
    };
  };
  const observable = new Observable<Asset>(loader);
  return options.bundler.register(path, observable);
};

export { createImage };
