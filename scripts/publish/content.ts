import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';

const POSTS_DIR = join(process.cwd(), 'src', 'content', 'posts');

interface Post {
  // directory name (used as tracking key and to derive Astro id)
  dirName: string;
  // Astro collection id (dirName/index)
  astroId: string;
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  publishOn: Date;
  tags: string[];
  body: string;
}

// Strip MDX-specific content that won't render on external platforms
const stripMdx = (content: string): string => {
  return content
    .split('\n')
    // Remove import statements
    .filter((line) => !line.trimStart().startsWith('import '))
    .join('\n')
    // Remove self-closing JSX components: <ComponentName ... />
    .replace(/<[A-Z][a-zA-Z]*[^>]*\/>/g, '')
    // Remove paired JSX components: <ComponentName ...>...</ComponentName>
    .replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, '')
    .trim();
};

const getPosts = async (): Promise<Post[]> => {
  const entries = await readdir(POSTS_DIR, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  const posts: Post[] = [];

  for (const dirName of dirs) {
    const filePath = join(POSTS_DIR, dirName, 'index.mdx');
    let raw: string;
    try {
      raw = await readFile(filePath, 'utf-8');
    } catch {
      // No index.mdx, skip
      continue;
    }

    const { data, content } = matter(raw);

    // publishOn falls back to pubDate if not set
    const pubDate = new Date(data.pubDate as string);
    const publishOn = data.publishOn ? new Date(data.publishOn as string) : pubDate;

    posts.push({
      dirName,
      astroId: `${dirName}/index`,
      slug: (data.slug as string) || dirName,
      title: data.title as string,
      description: data.description as string,
      pubDate,
      publishOn,
      tags: (data.tags as string[]) || [],
      body: stripMdx(content),
    });
  }

  return posts;
};

export type { Post };
export { getPosts };
