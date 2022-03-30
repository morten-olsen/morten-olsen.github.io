import { Service } from "typedi";

@Service()
abstract class AssetResolver {
  public abstract getPath(...loc: string[]): any;
}

export { AssetResolver };
