import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

import { data } from '@/data/data.ts';

export async function GET(context: APIContext) {
  const articles = await data.articles.find();
  const profile = data.profile;
  return rss({
    title: profile.basics.name,
    description: profile.basics.tagline,
    site: context.site || 'http://localhost:3000',
    items: articles.map((article) => ({
      ...article.data,
      link: `/articles/${article.data.slug}/`,
    })),
  });
}
