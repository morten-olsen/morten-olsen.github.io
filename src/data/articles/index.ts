import glob from 'fast-glob';
import sharp from 'sharp';
import { readFile } from "fs/promises";
import grayMatter from 'gray-matter';
import { basename, dirname, resolve } from "path";
import { Bundler } from '../../bundler';
import { loaders } from '../../loaders';
import { StaticImage } from '../../loaders/image';

type Article = {
  slug: string;
  title: string;
  published?: string;
  color: string;
  cover?: StaticImage;
  thumbnail?: StaticImage;
  body: string;
  markdown: string;
}

type ArticlesOptions = {
  cwd: string;
  pattern: string;
  bundler: Bundler;
  imageFormat?: keyof sharp.FormatEnum;
}

class Articles {
  #options: ArticlesOptions;
  #articles?: Promise<Article[]>;

  constructor(options: ArticlesOptions) {
    this.#options = options;
  }

  #loadArticle = async (path: string) => {
    const { bundler } = this.#options;
    const content = await readFile(path, 'utf-8');
    const { data, content: body } = grayMatter(content);
    const root = dirname(path);
    const fileName = basename(path);
    const markdown = await bundler.use(loaders.markdown({
      cwd: dirname(path),
      content: body,
      imageFormat: this.#options.imageFormat,
    }));
    const cover = data.cover ? await bundler.use(loaders.image({
      content: resolve(root, data.cover),
      format: this.#options.imageFormat,
    })) : undefined;

    const thumbnail = data.cover ? await bundler.use(loaders.image({
      content: resolve(root, data.cover),
      width: 300,
      height: 300,
      format: this.#options.imageFormat,
    })) : undefined;

    const article: Article = {
      slug: fileName,
      title: fileName,
      ...data as any,
      thumbnail,
      cover,
      body,
      markdown,
    }
    return article;
  }

  #loadArticles = async () => {
    const { pattern, cwd } = this.#options;
    const files = await glob(pattern, { cwd });
    const articles: Article[] = [];
    for (const file of files) {
      const fullPath = resolve(cwd, file);
      const article = await this.#loadArticle(fullPath);
      articles.push(article);
    }

    return articles;
  }

  #getArticles = async () => {
    if (!this.#articles) {
      this.#articles = this.#loadArticles();
    }
    return await this.#articles!;
  }

  public getAll = async () => {
    return await this.#getArticles();
  }
}

export type { Article };
export { Articles };
