import { resolve } from 'path';
import { createFile } from '../../resources/file';
import YAML from 'yaml';
import { Bundler } from '../../bundler';
import { Profile } from '../../../types';
import { createImage } from '../../resources/image';

type ProfileOptions = {
  path: string;
  cwd: string;
  bundler: Bundler;
};

const createProfile = ({ cwd, path, bundler }: ProfileOptions) => {
  const file = createFile({
    path: resolve(cwd, path),
  });

  const profile = file.pipe(async (yaml) => {
    const data = YAML.parse(yaml);
    const imagePath = resolve('content', data.image);
    const result: Profile = {
      ...data,
      imageUrl: createImage({
        image: imagePath,
        format: 'avif',
        bundler,
      }),
      imagePath,
    };
    return result;
  });

  return profile;
};

export { createProfile };
