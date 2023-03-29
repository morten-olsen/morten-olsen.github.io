import fastGlob from 'fast-glob';
import watchGlob from 'glob-watcher';
import { Observable } from '../../observable';
import { resolve } from 'path';

type GlobOptions<T> = {
  cwd: string;
  pattern: string;
  create?: (path: string) => T;
};

const defaultCreate = (a: any) => a;

const createGlob = <T = string>({ cwd, pattern, create = defaultCreate }: GlobOptions<T>) => {
  const setup = (item: any) => {
    if (item instanceof Observable) {
      item.subscribe(() => {
        glob.recreate();
      });
    }
  };
  const glob = new Observable(async () => {
    const files = await fastGlob(pattern, { cwd });
    return files.map((path) => {
      const item = create(resolve(cwd, path));
      setup(item);
      return item;
    });
  });

  const watcher = watchGlob(pattern, { cwd });
  watcher.on('add', (path) => {
    const item = create(resolve(cwd, path));
    glob.set((current) => Promise.resolve([...(current || []), item]));
    setup(item);

    return glob;
  });

  return glob;
};

export { createGlob };
