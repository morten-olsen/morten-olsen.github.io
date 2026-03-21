/**
 * Generates a GitHub profile README.md with neo-brutalist SVG cards.
 * Run with: npx tsx scripts/generate-readme.ts [--out-dir <dir>]
 *
 * IMPORTANT: GitHub proxies SVGs through camo.githubusercontent.com
 * which strips ALL <style> blocks. So we use inline style="" attributes
 * and SVG presentation attributes only. No CSS classes, no animations.
 */

import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import sharp from 'sharp';

const SKILLICONS_URL = 'https://skillicons.dev/icons?i=ts,react,python,rust,astro,nodejs,docker,kubernetes,terraform,aws,linux,neovim&perline=6';

const CONTENT_DIR = join(import.meta.dirname, '..', 'src', 'content');

const args = process.argv.slice(2);
const outDirIdx = args.indexOf('--out-dir');
const outDir = outDirIdx !== -1 ? args[outDirIdx + 1] : null;
const imagesDir = outDir ? join(outDir, 'images') : null;

// ============================================================
//  DESIGN SYSTEM
// ============================================================

const BORDER = 4;
const SHADOW = 6;

interface Theme {
  card: string; border: string; text: string; textMuted: string; shadow: string;
}

const themes: Record<string, Theme> = {
  light: { card: '#ffffff', border: '#000000', text: '#1a1a1a', textMuted: '#555555', shadow: '#000000' },
  dark: { card: '#1a1a2e', border: '#f0f0e8', text: '#f0f0e8', textMuted: '#8888a0', shadow: 'rgba(0,0,0,0.6)' },
};

const A = { yellow: '#ffee00', red: '#ff5757', cyan: '#00d4ff', lime: '#c8ff00', lavender: '#e4c1f9' };
const onAccent = '#000000';
const accents = [A.yellow, A.cyan, A.lime, A.lavender, A.red];

// Inline font styles (no CSS classes — GitHub strips <style> blocks)
const F_DISPLAY = `font-family="'Arial Black','Segoe UI Black',sans-serif" font-weight="900"`;
const F_BODY = `font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif"`;
const F_BODY_BOLD = `font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-weight="700"`;

// ============================================================
//  TYPES & LOADERS
// ============================================================

type Post = { title: string; slug: string; dirName: string; pubDate: Date; description: string; heroImage: string };
type Project = { name: string; slug: string; description: string; repo: string; stack: string[]; status?: string };
type Experience = { company: string; position: string; team?: string };

function loadPosts(): Post[] {
  const dir = join(CONTENT_DIR, 'posts');
  return readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => { try { const { data } = matter(readFileSync(join(dir, d.name, 'index.mdx'), 'utf-8')); return { title: data.title, slug: data.slug, dirName: d.name, pubDate: new Date(data.pubDate), description: data.description, heroImage: data.heroImage } as Post; } catch { return null; } })
    .filter((p): p is Post => p !== null)
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

function loadProjects(): Project[] {
  const dir = join(CONTENT_DIR, 'projects');
  return readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => { try { const { data } = matter(readFileSync(join(dir, d.name, 'index.mdx'), 'utf-8')); return { name: data.name, slug: data.slug, description: data.description, repo: data.repo, stack: data.stack || [], status: data.status } as Project; } catch { return null; } })
    .filter((p): p is Project => p !== null);
}

function loadCurrentExperience(): Experience | null {
  const dir = join(CONTENT_DIR, 'experiences');
  for (const file of readdirSync(dir, { recursive: true }).map(String).filter(f => f.endsWith('.mdx'))) {
    try { const { data } = matter(readFileSync(join(dir, file), 'utf-8')); if (!data.endDate) return { company: data.company.name, position: data.position.name, team: data.position.team }; } catch { /* skip */ }
  }
  return null;
}

// ============================================================
//  SVG HELPERS (all inline — no CSS)
// ============================================================

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function wrap(text: string, max: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (cur.length + w.length + 1 > max && cur) { lines.push(cur); cur = w; }
    else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) lines.push(cur);
  return lines;
}

function textW(text: string, fontSize: number, isDisplay = false): number {
  return text.length * fontSize * (isDisplay ? 0.68 : 0.55);
}

function brutalCard(x: number, y: number, w: number, h: number, t: Theme, fill?: string): string {
  return `<rect x="${x + SHADOW}" y="${y + SHADOW}" width="${w}" height="${h}" fill="${t.shadow}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill || t.card}" stroke="${t.border}" stroke-width="${BORDER}"/>`;
}

// ============================================================
//  BANNER — all positioning via SVG attributes, no CSS
// ============================================================

function generateBanner(mode: string): string {
  const t = themes[mode];
  const W = 900;
  const H = 230;
  const cx = W / 2;

  const nameX = (W - 200) / 2;
  const swX = (W - 380) / 2;
  const engX = (W - 340) / 2;
  const tagX = (W - 440) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <style>
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes wipeIn { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
    .a1 { animation: fadeIn 0.4s ease-out 0.2s both; }
    .a2 { animation: wipeIn 0.5s ease-out 0.4s both; }
    .a3 { animation: wipeIn 0.5s ease-out 0.6s both; }
    .a4 { animation: fadeIn 0.5s ease-out 0.8s both; }
  </style>

  <!-- Name label -->
  <g class="a1">
    <rect x="${nameX + SHADOW / 2}" y="${15 + SHADOW / 2}" width="200" height="30" fill="${t.shadow}"/>
    <rect x="${nameX}" y="15" width="200" height="30" fill="${A.yellow}" stroke="${onAccent}" stroke-width="2"/>
    <text x="${cx}" y="36" text-anchor="middle" ${F_BODY_BOLD} font-size="12" fill="${onAccent}" letter-spacing="2">MORTEN OLSEN</text>
  </g>

  <!-- SOFTWARE — rotated -2deg -->
  <g class="a2" transform="rotate(-2 ${cx} 85)">
    <rect x="${swX + SHADOW}" y="${55 + SHADOW}" width="380" height="60" fill="${t.shadow}"/>
    <rect x="${swX}" y="55" width="380" height="60" fill="${A.yellow}" stroke="${onAccent}" stroke-width="${BORDER}"/>
    <text x="${cx}" y="95" text-anchor="middle" ${F_DISPLAY} font-size="46" fill="${onAccent}">SOFTWARE</text>
  </g>

  <!-- ENGINEER — rotated 1deg -->
  <g class="a3" transform="rotate(1 ${cx} 145)">
    <rect x="${engX + SHADOW}" y="${120 + SHADOW}" width="340" height="50" fill="${t.shadow}"/>
    <rect x="${engX}" y="120" width="340" height="50" fill="${A.cyan}" stroke="${onAccent}" stroke-width="${BORDER}"/>
    <text x="${cx}" y="153" text-anchor="middle" ${F_DISPLAY} font-size="38" fill="${onAccent}">ENGINEER</text>
  </g>

  <!-- Tagline -->
  <g class="a4">
    <rect x="${tagX + SHADOW / 2}" y="${185 + SHADOW / 2}" width="440" height="32" fill="${t.shadow}"/>
    <rect x="${tagX}" y="185" width="440" height="32" fill="${A.lavender}" stroke="${onAccent}" stroke-width="2"/>
    <text x="${cx}" y="206" text-anchor="middle" ${F_BODY_BOLD} font-size="13" fill="${onAccent}">I make computers do questionable things.</text>
  </g>
</svg>`;
}

// ============================================================
//  POST CARD SVG — full-width horizontal (image left, text right)
//  Like the website's "wide" post card layout
// ============================================================

async function generatePostCard(post: Post, idx: number, mode: string): Promise<string> {
  const t = themes[mode];
  const cardW = 880;
  const cardH = 180;
  const imgW = 300;
  const pad = 12;
  const textPad = 28;
  const textX = imgW + BORDER + textPad;
  const accentColor = accents[idx % accents.length];
  const rot = [-0.3, 0.4, -0.2, 0.35][idx % 4];

  const heroPath = join(CONTENT_DIR, 'posts', post.dirName, post.heroImage.replace(/^\.\//, ''));
  const imgBuf = await sharp(heroPath)
    .resize(imgW * 2, cardH * 2, { fit: 'cover' })
    .jpeg({ quality: 75 })
    .toBuffer();
  const imgB64 = `data:image/jpeg;base64,${imgBuf.toString('base64')}`;

  const titleLines = wrap(post.title, 38);
  const descLines = wrap(post.description, 55).slice(0, 2);
  const date = post.pubDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();

  const svgW = cardW + SHADOW + pad * 2;
  const svgH = cardH + SHADOW + pad * 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
  <g transform="rotate(${rot} ${svgW / 2} ${svgH / 2})">
  ${brutalCard(pad, pad, cardW, cardH, t)}
  <!-- Hero image (left side) -->
  <defs><clipPath id="img"><rect x="${pad + BORDER / 2}" y="${pad + BORDER / 2}" width="${imgW - BORDER / 2}" height="${cardH - BORDER}"/></clipPath></defs>
  <image href="${imgB64}" x="${pad + BORDER / 2}" y="${pad + BORDER / 2}" width="${imgW}" height="${cardH - BORDER}" preserveAspectRatio="xMidYMid slice" clip-path="url(#img)"/>
  <!-- Vertical divider + accent stripe -->
  <line x1="${pad + imgW}" y1="${pad}" x2="${pad + imgW}" y2="${pad + cardH}" stroke="${t.border}" stroke-width="${BORDER}"/>
  <rect x="${pad + imgW}" y="${pad + BORDER / 2}" width="4" height="${cardH - BORDER}" fill="${accentColor}"/>
  <!-- Title -->
  ${titleLines.map((line, li) => `<text x="${pad + textX}" y="${pad + textPad + 18 + li * 24}" ${F_DISPLAY} font-size="16" fill="${t.text}">${esc(line)}</text>`).join('\n  ')}
  <!-- Description -->
  ${descLines.map((line, i) => `<text x="${pad + textX}" y="${pad + textPad + 18 + titleLines.length * 24 + 16 + i * 17}" ${F_BODY} font-size="12" fill="${t.textMuted}">${esc(line)}</text>`).join('\n  ')}
  <!-- Date -->
  <text x="${pad + textX}" y="${pad + cardH - textPad + 4}" ${F_BODY_BOLD} font-size="10" fill="${t.textMuted}">${date}</text>
  </g>
</svg>`;
}

// ============================================================
//  PROJECT CARD SVG — full-width horizontal
//  Accent bar on left, name badge + description + stack
// ============================================================

function generateProjectCard(project: Project, idx: number, mode: string): string {
  const t = themes[mode];
  const cardW = 880;
  const innerPad = 28;
  const accentBarW = 8;
  const contentX = innerPad + accentBarW;
  const descLines = wrap(project.description, 85).slice(0, 2);
  const stackStr = project.stack.slice(0, 7).join('  \u00b7  ');
  const nameUpper = project.name.toUpperCase();
  const nameW = textW(nameUpper, 16, true) + 28;
  const statusColors: Record<string, string> = { active: A.cyan, alpha: A.yellow, archived: '#888888' };
  const accentColor = accents[idx % accents.length];

  const cardH = innerPad + 32 + 12 + descLines.length * 18 + 12 + 14 + innerPad;
  const rot = [-0.25, 0.35, -0.2][idx % 3];
  const pad = 12;
  const svgW = cardW + SHADOW + pad * 2;
  const svgH = cardH + SHADOW + pad * 2;

  let statusSvg = '';
  if (project.status) {
    const sColor = statusColors[project.status] || '#888888';
    const sText = project.status.toUpperCase();
    const sW = textW(sText, 10) + 16;
    const sX = pad + contentX + nameW + SHADOW + 10;
    statusSvg = `<rect x="${sX}" y="${pad + innerPad + 2}" width="${sW}" height="26" fill="${sColor}" stroke="${onAccent}" stroke-width="2"/>
    <text x="${sX + sW / 2}" y="${pad + innerPad + 20}" text-anchor="middle" ${F_BODY_BOLD} font-size="10" fill="${onAccent}">${sText}</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
  <g transform="rotate(${rot} ${svgW / 2} ${svgH / 2})">
  ${brutalCard(pad, pad, cardW, cardH, t)}
  <!-- Accent bar -->
  <rect x="${pad + BORDER / 2}" y="${pad + BORDER / 2}" width="${accentBarW}" height="${cardH - BORDER}" fill="${accentColor}"/>
  <!-- Name badge with shadow -->
  <rect x="${pad + contentX + SHADOW / 2}" y="${pad + innerPad + SHADOW / 2}" width="${nameW}" height="30" fill="${t.shadow}"/>
  <rect x="${pad + contentX}" y="${pad + innerPad}" width="${nameW}" height="30" fill="${accentColor}" stroke="${onAccent}" stroke-width="2"/>
  <text x="${pad + contentX + nameW / 2}" y="${pad + innerPad + 21}" text-anchor="middle" ${F_DISPLAY} font-size="16" fill="${onAccent}">${esc(nameUpper)}</text>
  ${statusSvg}
  <!-- Description -->
  ${descLines.map((line, i) => `<text x="${pad + contentX}" y="${pad + innerPad + 52 + i * 18}" ${F_BODY} font-size="13" fill="${t.textMuted}">${esc(line)}</text>`).join('\n  ')}
  <!-- Stack -->
  <text x="${pad + contentX}" y="${pad + cardH - innerPad + 4}" ${F_BODY_BOLD} font-size="11" fill="${t.textMuted}" letter-spacing="0.3">${esc(stackStr)}</text>
  </g>
</svg>`;
}

// ============================================================
//  SECTION HEADER SVG — matches the website's .section-title
// ============================================================

function generateSectionHeader(title: string, accentColor: string, mode: string): string {
  const t = themes[mode];
  const titleUpper = title.toUpperCase();
  const w = textW(titleUpper, 28, true) + 40;
  const h = 44;
  const svgW = w + SHADOW + 4;
  const svgH = h + SHADOW + 4;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
  <rect x="${2 + SHADOW}" y="${2 + SHADOW}" width="${w}" height="${h}" fill="${t.shadow}"/>
  <rect x="2" y="2" width="${w}" height="${h}" fill="${accentColor}" stroke="${onAccent}" stroke-width="${BORDER}"/>
  <text x="${w / 2 + 2}" y="${h / 2 + 12}" text-anchor="middle" ${F_DISPLAY} font-size="24" fill="${onAccent}">${esc(titleUpper)}</text>
</svg>`;
}

// ============================================================
//  "CURRENTLY" BADGE SVG
// ============================================================

function generateCurrentlyBadge(exp: Experience, mode: string): string {
  const t = themes[mode];
  const label = `${exp.position}${exp.team ? ` · ${exp.team}` : ''} @ ${exp.company}`.toUpperCase();
  const labelW = textW(label, 10) + 24;
  const prefixW = textW('CURRENTLY', 10) + 20;
  const totalW = prefixW + 4 + labelW;
  const h = 28;
  const svgW = totalW + SHADOW + 4;
  const svgH = h + SHADOW + 4;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
  <rect x="${2 + SHADOW}" y="${2 + SHADOW}" width="${totalW}" height="${h}" fill="${t.shadow}"/>
  <rect x="2" y="2" width="${prefixW}" height="${h}" fill="${A.cyan}" stroke="${onAccent}" stroke-width="2"/>
  <text x="${prefixW / 2 + 2}" y="${h / 2 + 6}" text-anchor="middle" ${F_BODY_BOLD} font-size="10" fill="${onAccent}">CURRENTLY</text>
  <rect x="${2 + prefixW}" y="2" width="${labelW + 4}" height="${h}" fill="${t.card}" stroke="${onAccent}" stroke-width="2"/>
  <text x="${2 + prefixW + (labelW + 4) / 2}" y="${h / 2 + 6}" text-anchor="middle" ${F_BODY_BOLD} font-size="10" fill="${t.text}">${esc(label)}</text>
</svg>`;
}

// ============================================================
//  FUN BADGES SVG STRIP
// ============================================================

function generateBadgeStrip(mode: string): string {
  const t = themes[mode];

  const badges = [
    { label: 'SHIPS', value: 'BUGS', color: A.red },
    { label: 'MASS PRODUCES', value: 'SIDE PROJECTS', color: A.yellow },
    { label: 'WORKS ON', value: 'MY MACHINE', color: A.cyan },
  ];

  const gap = 10;
  const h = 28;
  const badgeWidths = badges.map(b => {
    const lw = textW(b.label, 10) + 16;
    const vw = textW(b.value, 10) + 16;
    return { lw, vw, total: lw + vw };
  });
  const totalW = badgeWidths.reduce((sum, b) => sum + b.total, 0) + gap * (badges.length - 1);
  const svgW = totalW + SHADOW + 4;
  const svgH = h + SHADOW + 4;

  let curX = 2;
  const badgeSvgs = badges.map((b, i) => {
    const { lw, vw, total } = badgeWidths[i];
    const x = curX;
    curX += total + gap;
    return `<!-- ${b.label} ${b.value} -->
  <rect x="${x + SHADOW}" y="${2 + SHADOW}" width="${total}" height="${h}" fill="${t.shadow}"/>
  <rect x="${x}" y="2" width="${lw}" height="${h}" fill="${onAccent}" stroke="${onAccent}" stroke-width="2"/>
  <text x="${x + lw / 2}" y="${h / 2 + 6}" text-anchor="middle" ${F_BODY_BOLD} font-size="10" fill="#ffffff">${b.label}</text>
  <rect x="${x + lw}" y="2" width="${vw}" height="${h}" fill="${b.color}" stroke="${onAccent}" stroke-width="2"/>
  <text x="${x + lw + vw / 2}" y="${h / 2 + 6}" text-anchor="middle" ${F_BODY_BOLD} font-size="10" fill="${onAccent}">${b.value}</text>`;
  }).join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
  ${badgeSvgs}
</svg>`;
}

// ============================================================
//  CTA BUTTON SVG
// ============================================================

function generateButton(label: string, accentColor: string, mode: string): string {
  const t = themes[mode];
  const labelUpper = label.toUpperCase();
  const w = textW(labelUpper, 13) + 40;
  const h = 36;
  const svgW = w + SHADOW + 4;
  const svgH = h + SHADOW + 4;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
  <rect x="${2 + SHADOW}" y="${2 + SHADOW}" width="${w}" height="${h}" fill="${t.shadow}"/>
  <rect x="2" y="2" width="${w}" height="${h}" fill="${t.card}" stroke="${t.border}" stroke-width="${BORDER}"/>
  <text x="${w / 2 + 2}" y="${h / 2 + 7}" text-anchor="middle" ${F_BODY_BOLD} font-size="13" fill="${t.text}">${esc(labelUpper)}</text>
</svg>`;
}

// ============================================================
//  HORIZONTAL RULE SVG
// ============================================================

function generateHr(mode: string): string {
  const t = themes[mode];
  const W = 900;
  const H = 20;
  const lineY = (H - BORDER) / 2;
  // Thick line with scattered accent blocks — like a deconstructed marquee
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect x="0" y="${lineY}" width="${W}" height="${BORDER}" fill="${t.border}"/>
  <rect x="80" y="2" width="16" height="16" fill="${A.yellow}" stroke="${t.border}" stroke-width="2"/>
  <rect x="320" y="4" width="24" height="12" fill="${A.red}" stroke="${t.border}" stroke-width="2"/>
  <rect x="440" y="1" width="20" height="18" fill="${A.cyan}" stroke="${t.border}" stroke-width="2"/>
  <rect x="600" y="4" width="12" height="12" fill="${A.lime}" stroke="${t.border}" stroke-width="2"/>
  <rect x="780" y="2" width="18" height="16" fill="${A.lavender}" stroke="${t.border}" stroke-width="2"/>
</svg>`;
}

// ============================================================
//  README ASSEMBLY
// ============================================================

function pic(base: string, alt: string): string {
  if (!imagesDir) return `<img src="./images/${base}-dark.svg" alt="${esc(alt)}">`;
  return `<picture><source media="(prefers-color-scheme: dark)" srcset="./images/${base}-dark.svg"><source media="(prefers-color-scheme: light)" srcset="./images/${base}-light.svg"><img src="./images/${base}-dark.svg" alt="${esc(alt)}"></picture>`;
}

async function main() {
  const posts = loadPosts();
  const projects = loadProjects();
  const currentExp = loadCurrentExperience();
  const recentPosts = posts.slice(0, 4);

  if (imagesDir) {
    mkdirSync(imagesDir, { recursive: true });
    for (const mode of ['light', 'dark']) {
      writeFileSync(join(imagesDir, `banner-${mode}.svg`), generateBanner(mode));
      for (let i = 0; i < recentPosts.length; i++) {
        writeFileSync(join(imagesDir, `post-${recentPosts[i].dirName}-${mode}.svg`), await generatePostCard(recentPosts[i], i, mode));
      }
      for (let i = 0; i < projects.length; i++) {
        writeFileSync(join(imagesDir, `project-${projects[i].slug}-${mode}.svg`), generateProjectCard(projects[i], i, mode));
      }

      // Section headers
      writeFileSync(join(imagesDir, `heading-building-${mode}.svg`), generateSectionHeader('What I\u2019m Building', A.red, mode));
      writeFileSync(join(imagesDir, `heading-writing-${mode}.svg`), generateSectionHeader('Recent Writing', A.yellow, mode));
      writeFileSync(join(imagesDir, `heading-tools-${mode}.svg`), generateSectionHeader('Things I Use', A.lime, mode));

      // Skill icons (downloaded to avoid external dependency)
      const skillRes = await fetch(`${SKILLICONS_URL}&theme=${mode}`);
      if (skillRes.ok) {
        writeFileSync(join(imagesDir, `skills-${mode}.svg`), await skillRes.text());
      }

      // Buttons & decorations
      writeFileSync(join(imagesDir, `btn-more-writing-${mode}.svg`), generateButton('More writing \u2192', A.yellow, mode));
      writeFileSync(join(imagesDir, `hr-${mode}.svg`), generateHr(mode));

      // Fun badges
      writeFileSync(join(imagesDir, `badges-${mode}.svg`), generateBadgeStrip(mode));

    }
  }

  const postLinks = recentPosts.map(p =>
    `<a href="https://mortenolsen.pro/posts/${p.slug}/">${pic(`post-${p.dirName}`, p.title)}</a>`
  );

  const projectLinks = projects.map(p =>
    `<a href="${p.repo}">${pic(`project-${p.slug}`, p.name)}</a>`
  );

  const readme = `<div align="center">

<a href="https://mortenolsen.pro">
${pic('banner', 'Morten Olsen — Software Engineer')}
</a>

<br>

[![mortenolsen.pro](https://img.shields.io/badge/mortenolsen.pro-000000?style=for-the-badge&logo=astro&logoColor=white)](https://mortenolsen.pro)&nbsp;
[![LinkedIn](https://img.shields.io/badge/LinkedIn-000000?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mortenolsendk)

</div>

${pic('hr', '')}

I'm **Morten** — a software engineer who's been drifting from .NET to React Native to Kubernetes to whatever shiny thing catches my eye next for the past 15+ years. Currently on the AI team at [ZeroNorth](https://www.zeronorth.com/), helping the maritime industry decarbonize. I also have two kids who are profoundly unimpressed by all of this.

I write about AI agents, infrastructure, developer tools, and the mistakes I make building all of them at **[mortenolsen.pro](https://mortenolsen.pro)**.

${pic('heading-building', 'What I\'m Building')}

${projectLinks.join('\n\n')}

${pic('heading-writing', 'Recent Writing')}

${postLinks.join('\n\n')}

<a href="https://mortenolsen.pro">${pic('btn-more-writing', 'More writing')}</a>

<br>

${pic('heading-tools', 'Things I Use')}

<div align="center">

${pic('skills', 'Tech stack')}

<br><br>

${pic('badges', 'ships bugs · mass produces side projects · works on my machine')}

</div>

${pic('hr', '')}


<div align="center">
<sub>Auto-generated from <a href="https://github.com/morten-olsen/morten-olsen.github.io">morten-olsen.github.io</a> \u2014 because maintaining two sources of truth is a lie I stopped telling myself.</sub>
</div>
`;

  process.stdout.write(readme);
}

main();
