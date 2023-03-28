import { resolve } from 'path';
import { Observable, getCollectionItems } from '../observable';
import { createPage } from '../resources/page';
import { Bundler } from '../bundler';
import { forEach } from '../utils/observable';
import { createLatex } from '../resources/latex';
import { markdownToLatex } from '../utils/markdown';
import { Position } from '../../types';
import { Config } from '../../types/config';
import { getTemplates } from './templates';
import { getData } from './data';

const build = async (cwd: string, config: Config) => {
  const bundler = new Bundler();
  const data = getData({
    cwd,
    config,
    bundler,
  });
  const templates = getTemplates(cwd, config);

  const resumeData = Observable.combine({
    articles: data.articles.pipe(getCollectionItems),
    // TODO: collection observer
    positions: data.positions.pipe(async (positions) => {
      const result: Position[] = [];
      for (const a of positions) {
        const item = await a.data;
        const content = markdownToLatex({
          root: resolve('content'),
          content: item.raw,
        });
        result.push({
          ...item,
          content,
        });
      }
      return result;
    }),
    profile: data.profile,
  });

  resumeData.subscribe(() => {
    console.log('resume');
  });

  const resumeUrl = createLatex({
    bundler,
    path: '/resume',
    data: resumeData,
    template: templates.latex.resume,
  });

  {
    const props = Observable.combine({
      articles: data.articles.pipe(getCollectionItems),
      positions: data.positions.pipe(getCollectionItems),
      profile: data.profile,
      resumeUrl: Observable.link([resumeUrl.item], async () => resumeUrl.url),
    });
    createPage({
      path: '/',
      props,
      template: templates.react.frontpage,
      bundler,
    });
  }

  await forEach(data.articles, async (article) => {
    const { slug } = await article.data;
    const pdf = createLatex({
      bundler,
      path: resolve('/articles', slug),
      template: templates.latex.article,
      data: Observable.combine({
        profile: data.profile,
        article: article.pipe(async ({ title, cover, root, raw }) => {
          const body = markdownToLatex({
            root,
            content: raw,
          });
          return {
            title,
            body,
            cover: resolve(root, cover),
          };
        }),
      }),
    });
    const props = Observable.combine({
      article,
      profile: data.profile,
      pdfUrl: Observable.link([pdf.item], async () => pdf.url),
    });
    article.subscribe(() => {
      console.log('updated', slug);
    });
    createPage({
      path: `/articles/${slug}`,
      props,
      template: templates.react.article,
      bundler,
    });
  });

  return bundler;
};

export { build };
