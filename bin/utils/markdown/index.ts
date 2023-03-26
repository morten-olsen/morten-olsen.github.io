import { resolve } from "path";
import { decode } from "html-entities";
import { marked } from "marked";
import remark from "remark";
import visit from "unist-util-visit";
import { Bundler } from "../../bundler";
import { createImage } from "../../resources/image";
import { renderer } from "./latex";

type MarkdownBundleImagesOptions = {
  cwd: string;
  content: string;
  bundler: Bundler;
};

const markdownBundleImages = async ({
  bundler,
  cwd,
  content,
}: MarkdownBundleImagesOptions) => {
  const result = await remark()
    .use(() => (tree) => {
      visit(tree, "image", (node) => {
        if (!("url" in node)) {
          return;
        }
        const url = node.url as string;
        const path = resolve(cwd, url);
        const image = createImage({
          image: path,
          bundler,
          format: "webp",
        });
        const newUrl = image;
        node.url = newUrl;
      });
    })
    .process(content);
  return String(result);
};

type MarkdownToLatexOptions = {
  root: string;
  content: string;
};

const markdownToLatex = ({ root, content }: MarkdownToLatexOptions) => {
  const render: any = {
    ...renderer(0),
  };
  const latex = marked(content, {
    renderer: render,
  });
  return decode(latex);
};
export { markdownBundleImages, markdownToLatex };
