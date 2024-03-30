import { type Article, data } from '@/data/data.ts';
import type { APIContext } from 'astro';

type Props = {
  article: Article;
};

export async function GET(context: APIContext<Props>) {
  const { props } = context;
  const { article } = props;
  return new Response(JSON.stringify(article), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getStaticPaths() {
  const articles = await data.articles.find();
  return articles.map((article) => ({
    params: { slug: article.slug },
    props: { article },
  }));
}
