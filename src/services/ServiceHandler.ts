import ArticleService from './Articles';

class ServiceHandler {
  private _articles: ArticleService = new ArticleService();
  private _prepareCache?: Promise<void>;

  private _prepare = async() => {
    await this._articles.setup();
  };

  public get articles() {
    return this._articles;
  }

  public prepare = async () => {
    if (this._prepareCache) {
      return this._prepareCache;
    }

    this._prepareCache = this._prepare();

    return this._prepareCache;
  };
}

export default ServiceHandler;
