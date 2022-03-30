import fs from 'fs-extra';
import path from 'path';
import { Service } from 'typedi';
import yaml from 'yaml';
import { config } from '../../config';
import { AssetResolver } from '../assets';
import { generate, MarkdownSection } from '../helpers/markdown';
import readingTime from 'reading-time';

export type ArticlePart = string | {
  title?: string;
  file?: string;
  notes?: string;
  parts?: ArticlePart[];
}

export type Article = {
  id: string;
  title: string;
  parts: MarkdownSection[];
  cover?: string;
  summery?: string;
  published?: string;
  content: string;
  stats: ReturnType<typeof readingTime>;
  shareImage?: string;
  pdfs: {
    a4: string;
  };
}

@Service()
export class ArticleDB {
  #articles: Promise<Article[]>;
  #assets: AssetResolver;

  constructor(
    assets: AssetResolver,
  ) {
    this.#assets = assets;
    this.#articles = this.#load();
  }

  #loadArticle = async (location: string) => {
    const id = path.basename(location);
    const structureLocation = path.join('content', location, 'index.yml');
    const structureContent = await fs.readFile(structureLocation, 'utf-8');
    const structure = yaml.parse(structureContent) as Article; 

    const articleContent = await Promise.all(
      structure.parts.map((part) => generate(
        location,
        part,
        2,
        this.#assets,
      )),
    );
    const cover = structure.cover
      ? this.#assets.getPath(path.resolve('/', location, structure.cover))
      : null;
    const shareImage = structure.shareImage
      ? this.#assets.getPath(path.resolve('/', location, structure.shareImage))
      : null;
    const stats = readingTime(articleContent.join('\n'));

    const article: Article = {
      ...structure,
      id,
      cover,
      content: articleContent.join('\n'),
      shareImage,
      stats,
      pdfs: {
        a4: this.#assets.getPath(
          path.resolve('/', 'articles', id, 'a4.gen.yml'),
        )?.url || null,
      }
    };

    return article;
  };

  #load = async () => {
    const rootLocation = path.join('content', 'articles');
    const articleLocations = await fs.readdir(rootLocation);
    const articles = await Promise.all(articleLocations.map(
      (location) => this.#loadArticle(path.join('articles', location)),
    ));
    return articles
      .sort((a, b) => new Date(b.published || 0).getTime() - new Date(a.published || 0).getTime())
      .filter(a => a.published || config.dev)

  }

  public get = async (id: string) => {
    const articles = await this.list();
    const article = articles.find(a => a.id === id);
    return article;
  };

  public list = async () => {
    const articles = await this.#articles;
    return articles;
  }
}
