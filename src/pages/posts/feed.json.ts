import type { APIContext } from 'astro';
import { data } from '~/data/data';
import { renderPost } from '~/utils/render-post';
import { getImage } from 'astro:assets';

const GET = async (context: APIContext) => {
  const siteUrl = context.site?.toString() ?? 'http://localhost:4321/';
  const posts = await data.posts.getPublished();

  const items = await Promise.all(
    posts.map(async (post) => {
      const { html, markdown } = await renderPost(post, { siteUrl });
      const hero = await getImage({ src: post.data.heroImage });
      return {
        id: new URL(`/posts/${post.id}`, siteUrl).href,
        url: new URL(`/posts/${post.id}`, siteUrl).href,
        title: post.data.title,
        summary: post.data.description,
        content_html: html,
        content_text: markdown,
        date_published: post.data.pubDate.toISOString(),
        date_modified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
        tags: post.data.tags,
        image: new URL(hero.src, siteUrl).href,
        authors: [{ name: data.profile.name, url: data.profile.url }],
        language: 'en',
      };
    }),
  );

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: data.profile.name,
    home_page_url: siteUrl,
    feed_url: new URL('/posts/feed.json', siteUrl).href,
    description: 'Cross-post feed with full markdown bodies',
    language: 'en',
    authors: [{ name: data.profile.name, url: data.profile.url }],
    items,
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
    },
  });
};

export { GET };
