import fastGlob from "fast-glob";
import watchGlob from "glob-watcher";
import { Observable } from "../../observable";

type GlobOptions<T> = {
  cwd?: string;
  pattern: string;
  create?: (path: string) => T;
};

const defaultCreate = (a: any) => a;

const createGlob = <T = string>({
  cwd,
  pattern,
  create = defaultCreate,
}: GlobOptions<T>) => {
  const glob = new Observable(async () => {
    const files = await fastGlob(pattern, { cwd });
    return files.map(create);
  });

  const watcher = watchGlob(pattern, { cwd });
  watcher.on("add", (path) => {
    glob.set((current) => Promise.resolve([...(current || []), create(path)]));

    return glob;
  });

  return glob;
};

export { createGlob };
