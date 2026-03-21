/**
 * Generates a GitHub profile README.md from site content.
 * Run with: npx tsx scripts/generate-readme.ts [--out-dir <dir>]
 *
 * When --out-dir is provided, optimized hero images are written there
 * and the README references them as relative paths. Without it,
 * images point to raw.githubusercontent.com (unoptimized).
 */

import { readFileSync, readdirSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import matter from 'gray-matter';
import sharp from 'sharp';

const CONTENT_DIR = join(import.meta.dirname, '..', 'src', 'content');
const IMAGE_WIDTH = 560; // 2x of 280px display for retina

const args = process.argv.slice(2);
const outDirIdx = args.indexOf('--out-dir');
const outDir = outDirIdx !== -1 ? args[outDirIdx + 1] : null;

type Post = { title: string; slug: string; dirName: string; pubDate: Date; description: string; heroImage: string };
type Project = { name: string; slug: string; description: string; repo: string; stack: string[]; status?: string };

function loadPosts(): Post[] {
  const postsDir = join(CONTENT_DIR, 'posts');
  const dirs = readdirSync(postsDir, { withFileTypes: true }).filter(d => d.isDirectory());
  const posts: Post[] = [];
  for (const dir of dirs) {
    const file = join(postsDir, dir.name, 'index.mdx');
    try {
      const { data } = matter(readFileSync(file, 'utf-8'));
      posts.push({
        title: data.title,
        slug: data.slug,
        dirName: dir.name,
        pubDate: new Date(data.pubDate),
        description: data.description,
        heroImage: data.heroImage,
      });
    } catch { /* skip */ }
  }
  return posts.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

function loadProjects(): Project[] {
  const projectsDir = join(CONTENT_DIR, 'projects');
  const dirs = readdirSync(projectsDir, { withFileTypes: true }).filter(d => d.isDirectory());
  const projects: Project[] = [];
  for (const dir of dirs) {
    const file = join(projectsDir, dir.name, 'index.mdx');
    try {
      const { data } = matter(readFileSync(file, 'utf-8'));
      projects.push({
        name: data.name,
        slug: data.slug,
        description: data.description,
        repo: data.repo,
        stack: data.stack || [],
        status: data.status,
      });
    } catch { /* skip */ }
  }
  return projects;
}

function sourceImagePath(post: Post): string {
  const relative = post.heroImage.replace(/^\.\//, '');
  return join(CONTENT_DIR, 'posts', post.dirName, relative);
}

async function optimizeImage(post: Post): Promise<string> {
  const src = sourceImagePath(post);
  const outName = `${post.dirName}.webp`;

  if (outDir) {
    const imagesDir = join(outDir, 'images');
    mkdirSync(imagesDir, { recursive: true });
    await sharp(src)
      .resize(IMAGE_WIDTH, undefined, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(join(imagesDir, outName));
    return `./images/${outName}`;
  }

  // Fallback: raw GitHub URL (unoptimized)
  const relative = post.heroImage.replace(/^\.\//, '');
  return `https://raw.githubusercontent.com/morten-olsen/morten-olsen.github.io/main/src/content/posts/${post.dirName}/${relative}`;
}

function stackBadges(stack: string[]): string {
  return stack.map(t => `\`${t}\``).join(' ');
}

async function main() {
  const posts = loadPosts();
  const projects = loadProjects();
  const recentPosts = posts.slice(0, 5);

  // Optimize images in parallel
  const imageUrls = await Promise.all(recentPosts.map(p => optimizeImage(p)));

  const readme = `<div align="center">

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Space+Grotesk&weight=700&size=32&pause=1000&color=000000&background=FFEE00&vCenter=true&random=false&width=620&height=60&lines=software+engineer+%7C+copenhagen;i+mass-produce+side+projects;currently+arguing+with+language+models;my+homelab+is+more+complex+than+it+needs+to+be)](https://mortenolsen.pro)

<br>

[![Website](https://img.shields.io/badge/mortenolsen.pro-000000?style=for-the-badge&logo=astro&logoColor=white)](https://mortenolsen.pro)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-000000?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mortenolsendk)

</div>

---

I'm **Morten** — a software engineer who's been drifting from .NET to React Native to Kubernetes to whatever shiny thing catches my eye next for the past 15+ years. Currently on the AI team at [ZeroNorth](https://www.zeronorth.com/), helping the maritime industry decarbonize. I also have two kids who are profoundly unimpressed by all of this.

I write about the things I build and the mistakes I make along the way at **[mortenolsen.pro](https://mortenolsen.pro)**.

<br>

## ⚡ What I'm Building

<table>
${projects.map(p => `<tr>
<td width="140" align="center">
<br>
<a href="${p.repo}"><b>${p.name}</b></a>
<br><br>
${p.status ? `<img src="https://img.shields.io/badge/${p.status}-${p.status === 'active' ? '00d4ff' : p.status === 'alpha' ? 'ffee00' : '888888'}?style=flat-square" alt="${p.status}">` : ''}
<br><br>
</td>
<td>

${p.description}

${stackBadges(p.stack)}

</td>
</tr>`).join('\n')}
</table>

<br>

## ✏️ Recent Writing

<table>
${recentPosts.map((p, i) => `<tr>
<td width="280">
<a href="https://mortenolsen.pro/posts/${p.slug}/"><img src="${imageUrls[i]}" alt="${p.title}" width="280"></a>
</td>
<td>
<a href="https://mortenolsen.pro/posts/${p.slug}/"><b>${p.title}</b></a>
<br><br>
${p.description}
</td>
</tr>`).join('\n')}
</table>

<br>

## 🛠️ Things I Use

<div align="center">

[![My Skills](https://skillicons.dev/icons?i=ts,react,python,rust,astro,nodejs,docker,kubernetes,terraform,aws,linux,neovim&theme=dark&perline=6)](https://mortenolsen.pro/about/)

</div>

<br>

<div align="center">

![ships bugs](https://img.shields.io/badge/ships-bugs-ff5757?style=for-the-badge&labelColor=000000)
![mass produces](https://img.shields.io/badge/mass%20produces-side%20projects-ffee00?style=for-the-badge&labelColor=000000)
![works on](https://img.shields.io/badge/works%20on-my%20machine-00d4ff?style=for-the-badge&labelColor=000000)

</div>

---

<div align="center">
<sub>This README is generated from my <a href="https://github.com/morten-olsen/morten-olsen.github.io">portfolio site</a> — because maintaining two sources of truth is a lie I stopped telling myself.</sub>
</div>
`;

  process.stdout.write(readme);
}

main();
