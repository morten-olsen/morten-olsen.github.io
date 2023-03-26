import { resolve } from "path";
import { createReact } from "../resources/react";
import { Observable, getCollectionItems } from "../observable";
import { createPage } from "../resources/page";
import { createArticles } from "../data/articles";
import { Bundler } from "../bundler";
import { forEach } from "../utils/observable";
import { createEjs } from "../resources/ejs";
import { createLatex } from "../resources/latex";
import { markdownToLatex } from "../utils/markdown";
import { createPositions } from "../data/positions";
import { createProfile } from "../data/profile";
import { Position } from "../../types";

const build = async () => {
  const bundler = new Bundler();
  const articles = createArticles({
    bundler,
  });
  const positions = createPositions({
    bundler,
  });
  const profile = createProfile({
    bundler,
  });

  const latex = {
    article: createEjs(resolve("content/templates/latex/article.tex")),
    resume: createEjs(resolve("content/templates/latex/resume.tex")),
  };

  const react = {
    article: createReact(resolve("content/templates/react/article.tsx")),
    frontpage: createReact(resolve("content/templates/react/frontpage.tsx")),
  };

  const resumeProps = Observable.combine({
    articles: articles.pipe(getCollectionItems),
    positions: positions.pipe(async (positions) => {
      const result: Position[] = [];
      for (const a of positions) {
        const item = await a.data;
        const content = markdownToLatex({
          root: resolve("content"),
          content: item.raw,
        });
        result.push({
          ...item,
          content,
        });
      }
      return result;
    }),
    profile,
  });

  const resumeUrl = createLatex({
    bundler,
    path: "/resume",
    data: resumeProps,
    template: latex.resume,
  });

  {
    const props = Observable.combine({
      articles: articles.pipe(getCollectionItems),
      positions: positions.pipe(getCollectionItems),
      profile,
      resumeUrl: new Observable(async () => resumeUrl),
    });
    createPage({
      path: "/",
      props,
      template: react.frontpage,
      bundler,
    });
  }

  await forEach(articles, async (article) => {
    const { slug } = await article.data;
    const pdfUrl = createLatex({
      bundler,
      path: resolve("/articles", slug),
      template: latex.article,
      data: Observable.combine({
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
      profile,
      pdfUrl: new Observable(async () => pdfUrl),
      resumeUrl: new Observable(async () => resumeUrl),
    });
    createPage({
      path: `/articles/${slug}`,
      props,
      template: react.article,
      bundler,
    });
  });

  return bundler;
};

export { build };
