import path from 'path';
import fs from 'fs-extra';
import renderToString from "next-mdx-remote/render-to-string";
import matter from 'gray-matter';
import BaseService from '../BaseService';
import getComponents from '../../articleComponents';
import codeImport from 'remark-code-import';
import hint from 'remark-hint';

interface Article {
  name: string;
  mdx: any;
  data: any;
}

class ArticleService extends BaseService {
  private _articles: Article[] = [];

  public get list() {
    return this._articles;
  }

  public get = (name: string) => {
    return this._articles.find(a => a.name === name);
  }

  public setup = async () => {
    const articlesLocation = path.join(process.cwd(), 'src', 'articles');
    const directories = await fs.readdir(articlesLocation);
    const articles = await Promise.all(directories.map(async(dir) => {
      const articleLocation = path.join(articlesLocation, dir);
      const articleContentLocation = path.join(articleLocation, 'index.mdx');
      const raw = await fs.readFile(articleContentLocation, 'utf-8');
      const { content, data } = matter(raw);
      const mdx = await renderToString(content, {
        components: getComponents(dir),
        mdxOptions: {
          remarkPlugins: [
            codeImport,
            hint,
          ],
        },
      });
      return {
        name: dir,
        mdx,
        data,
      };
    }));

    this._articles = articles;
  };
}

export default ArticleService;
