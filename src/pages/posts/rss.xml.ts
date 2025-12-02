import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { data } from '~/data/data';


const GET = async (context: APIContext) => {
  const posts = await data.posts.getPublished();
  return rss({
    title: data.profile.name,
    description: 'Bar',
    site: context.site || 'http://localhost:3000',
    items: posts.map((post) => ({
      ...post.data,
      link: `/posts/${post.id}`,
    })),
  });
}

export { GET }
