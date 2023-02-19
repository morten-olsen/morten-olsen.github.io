import { pipe } from './utils';

type BundleFile = {
  path: string;
  content: string | Buffer;
}

type LoaderApi = {
  bundler: Bundler;
};

type Loader<TOutput> = (api: LoaderApi) => TOutput;

class Bundler {
  #files: BundleFile[] = [];

  public add = (file: BundleFile) => {
    const path = `/${file.path}`;
    this.#files.push({
      ...file,
      path,
    });
    return path;
  }

  public use = <TLoader extends Loader<any>>(loader: TLoader) => {
    const output = loader({ bundler: this });
    return output;
  };

  public get = (path: string) => {
    return this.#files.find((file) => file.path === path);
  }


  public write = async (outDir: string) => {
    console.log(this.#files);
  }
}

export type { BundleFile, Loader, LoaderApi };
export { pipe };
export { Bundler };
