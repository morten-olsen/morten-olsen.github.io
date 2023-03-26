import { createGlob } from "../../resources/glob";
import { createFile } from "../../resources/file";
import grayMatter from "gray-matter";
import { Article } from "../../../types/article";
import { Bundler } from "../../bundler";
import { markdownBundleImages } from "../../utils/markdown";
import { dirname, resolve } from "path";
import { createImage } from "../../resources/image";

type ArticleOptions = {
  bundler: Bundler;
};

const createArticles = ({ bundler }: ArticleOptions) => {
  const files = createGlob({
    pattern: "content/articles/**/*.md",
    create: (path) => {
      const file = createFile({ path });
      const article = file.pipe(async (raw) => {
        const { data, content } = grayMatter(raw);
        const { title, slug, cover, color } = data;
        const cwd = dirname(path);
        const markdown = await markdownBundleImages({
          cwd,
          content,
          bundler,
        });
        const coverUrl = createImage({
          image: resolve(cwd, cover),
          format: "avif",
          bundler,
        });
        const thumbUrl = createImage({
          image: resolve(cwd, cover),
          format: "avif",
          width: 400,
          bundler,
        });
        const result: Article = {
          title,
          raw: content,
          cover,
          root: cwd,
          content: markdown,
          coverUrl,
          thumbUrl,
          color,
          slug,
        } as any;
        return result;
      });
      return article;
    },
  });

  return files;
};

export { createArticles };
