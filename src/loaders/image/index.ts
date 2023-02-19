import sharp from 'sharp';
import { Loader } from '../../bundler';
import { createHash } from 'crypto';

type StaticImage = {
  src: string;
  blurDataURL: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

type Options = {
  content: string | Buffer;
  width?: number;
  height?: number;
  format?: keyof sharp.FormatEnum;
  blurSize?: number;
};

const imageLoader = ({
  content,
  width,
  height,
  format,
  blurSize = 10,
}: Options): Loader<Promise<StaticImage>> => async ({
  bundler,
}) => {
  let img = sharp(content);
  if (height || width) {
    img = img.resize(width, height);
  }
  if (format) {
    img = img.toFormat(format);
  }
  const meta = await img.metadata();
  const aspectRatio = meta.width && meta.height ? meta.width / meta.height : undefined;
  const extention = format || meta.format;
  const buffer = await img.toBuffer();
  const hash = createHash('sha256').update(buffer).digest('hex').substring(0, 12);
  const src = bundler.add({
    path: `images/${hash}.${extention}`,
    content: buffer,
  });
  const blurDataURL = await img.resize(Math.round(blurSize), Math.round(blurSize * (aspectRatio || 1))).toBuffer();
  return {
    src,
    width,
    height,
    aspectRatio,
    blurDataURL: `data:image/${extention};base64,${blurDataURL.toString('base64')}`,
  }
};

export type { StaticImage };
export { imageLoader };

