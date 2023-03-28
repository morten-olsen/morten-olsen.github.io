import { Config } from '../../types/config';
import { Bundler } from '../bundler';
import { createArticles } from '../data/articles';
import { createPositions } from '../data/positions';
import { createProfile } from '../data/profile';

type GetDataOptions = {
  cwd: string;
  config: Config;
  bundler: Bundler;
};

const getData = ({ cwd, config, bundler }: GetDataOptions) => ({
  articles: createArticles({
    cwd,
    pattern: config.articles.pattern,
    bundler,
  }),
  positions: createPositions({
    cwd,
    pattern: config.positions.pattern,
    bundler,
  }),
  profile: createProfile({
    cwd,
    path: config.profile.path,
    bundler,
  }),
});

export { getData };
