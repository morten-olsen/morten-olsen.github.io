import { resolve } from "path";
import { Bundler } from "./bundler"
import { loaders } from "./loaders";
import { createReactLoader } from "./loaders/react";
import { FrontPage } from './ui/pages/frontpage';
import { ArticlePage } from './ui/pages/article';
import { Html } from './ui/components/html';
import { createContext } from "./context";

const create = async () => {
  const bundler = new Bundler();
  const context = await createContext(bundler);

  const script = await bundler.use(loaders.script({
    entry: resolve(__dirname, 'scripts/main.ts'),
  }));

  const react = createReactLoader({
    component: Html,
    context,
    props: {
      scripts: [script]
    },
  })

  await bundler.use(react({
    path: 'index.html',
    component: FrontPage, 
    props: {},
  }));

  for (let article of context.articles) {
    await bundler.use(react({
      path: `articles/${article.slug}.html`,
      component: ArticlePage,
      props: {
        article,
      },
    }));
  }

  return bundler;
}

export { create };
