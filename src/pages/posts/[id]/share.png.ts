import type { APIContext, GetStaticPaths } from 'astro';
import { data } from '~/data/data';
import { createCanvas } from 'canvas';

const getStaticPaths = (async () => {
  const posts = await data.posts.getPublished();
  return posts.map((post) => ({
    params: { id: post.id }
  }));
}) satisfies GetStaticPaths;

const GET = async (context: APIContext<Record<string, string>, { id: string }>) => {
  const { id } = context.params;
  const post = await data.posts.get(id);
  const canvas = createCanvas(200, 200)
  const ctx = canvas.getContext('2d')

  ctx.fillText(post.data.title, 10, 10)
  const buffer = await new Promise<Buffer>((resolve, reject) => {
    canvas.toBuffer((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  })
  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/png',
    }
  })
}

export { GET, getStaticPaths }
