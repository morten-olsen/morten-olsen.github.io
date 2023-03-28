import { readFile } from 'fs/promises';
import { Observable } from '../../observable';
import { watch } from 'fs';

type FileOptions = {
  path: string;
};

const createFile = ({ path }: FileOptions) => {
  let watcher: ReturnType<typeof watch> | undefined;
  const addWatcher = () => {
    if (watcher) {
      watcher.close();
    }
    watcher = watch(path, () => {
      file.recreate();
      addWatcher();
    });
  };

  const file = new Observable(async () => {
    addWatcher();
    return readFile(path, 'utf-8');
  });

  return file;
};

export { createFile };
