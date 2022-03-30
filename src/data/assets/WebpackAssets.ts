import path from 'path';
import { AssetResolver } from './';

const assetModules = (require as any).context(
  '../../../content',
  true,
  /\.(png|jpe?g|svg|gif|gen\.yml)$/,
)
const assets = assetModules.keys().reduce((output, key: string) => ({
  ...output,
  [path.resolve(
    '/',
    key,
  )]: assetModules(key).default || assetModules(key),
}), {} as any);

class WebpackAssetResolver extends AssetResolver {
  #assets = assets;

  public getPath = (...location: string[]) => {
    const target = path.resolve(
      '/',
      ...location,
    );
    const assetModule = this.#assets[target];
    return assetModule;
  }
}

export { WebpackAssetResolver };
