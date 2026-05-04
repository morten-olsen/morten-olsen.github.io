import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { data } from '~/data/data';
import { renderPost } from '~/utils/render-post';

const GET = async (context: APIContext) => {
  const siteUrl = context.site?.toString() ?? 'http://localhost:4321/';
  const posts = await data.posts.getPublished();
  const items = await Promise.all(
    posts.map(async (post) => {
      const { html } = await renderPost(post, { siteUrl });
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/posts/${post.id}`,
        content: html,
      };
    }),
  );
  return rss({
    title: data.profile.name,
    description: 'Full-text feed',
    site: context.site || 'http://localhost:3000',
    items,
  });
};

export { GET };
