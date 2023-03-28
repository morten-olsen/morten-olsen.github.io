import { resolve } from 'path';
import { Observable } from '../observable';

type Asset = {
  content: string | Buffer;
};

class Bundler {
  #assets: Map<string, Observable<Asset>>;

  constructor() {
    this.#assets = new Map();
  }

  public get paths() {
    return [...this.#assets.keys()];
  }

  public register = (path: string, asset: Observable<Asset>) => {
    const realPath = resolve('/', path);
    if (!this.#assets.has(realPath)) {
      this.#assets.set(realPath, asset);
    }
    return realPath;
  };

  public get = (path: string) => {
    const realPath = resolve('/', path);
    return this.#assets.get(realPath);
  };
}

export type { Asset };
export { Bundler };
