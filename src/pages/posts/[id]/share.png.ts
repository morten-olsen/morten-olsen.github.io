import type { APIContext, GetStaticPaths } from 'astro';
import { data } from '~/data/data';
import { createCanvas, loadImage, registerFont, type CanvasRenderingContext2D } from 'canvas';
import path from 'node:path';

// Register Space Grotesk fonts (with guard for hot reload)
const fontsRegistered = new Set<string>();

const safeRegisterFont = (fontPath: string, options: { family: string; weight: string }) => {
  const key = `${options.family}-${options.weight}`;
  if (!fontsRegistered.has(key)) {
    try {
      registerFont(fontPath, options);
      fontsRegistered.add(key);
    } catch {
      // Font already registered or path issue - ignore in dev
    }
  }
};

const fontPathBold = path.join(
  process.cwd(),
  'node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff'
);
const fontPathRegular = path.join(
  process.cwd(),
  'node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff'
);
safeRegisterFont(fontPathBold, { family: 'Space Grotesk', weight: 'bold' });
safeRegisterFont(fontPathRegular, { family: 'Space Grotesk', weight: 'normal' });

const WIDTH = 1200;
const HEIGHT = 630;
const PADDING = 48;
const IMAGE_WIDTH = 580;
const GRADIENT_WIDTH = 120;
const INFO_X = IMAGE_WIDTH + 40;
const INFO_WIDTH = WIDTH - INFO_X - PADDING;
const MAX_TITLE_FONT_SIZE = 52;
const MIN_TITLE_FONT_SIZE = 28;

const getStaticPaths = (async () => {
  const posts = await data.posts.getPublished();
  return posts.map((post) => ({
    params: { id: post.id }
  }));
}) satisfies GetStaticPaths;

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
};

const findFontSize = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxHeight: number,
  maxFontSize: number,
  minFontSize: number
): { fontSize: number; lines: string[] } => {
  for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 2) {
    ctx.font = `bold ${fontSize}px "Space Grotesk"`;
    const lines = wrapText(ctx, text, maxWidth);
    const lineHeight = fontSize * 1.25;
    const totalHeight = lines.length * lineHeight;
    if (totalHeight <= maxHeight) {
      return { fontSize, lines };
    }
  }
  ctx.font = `bold ${minFontSize}px "Space Grotesk"`;
  return { fontSize: minFontSize, lines: wrapText(ctx, text, maxWidth) };
};

const GET = async (context: APIContext<Record<string, string>, { id: string }>) => {
  const { id } = context.params;
  const post = await data.posts.get(id);

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#f0f0e8';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Load and draw cover image on the left
  const heroImage = post.data.heroImage;
  const imagePath = (heroImage as { fsPath?: string }).fsPath;

  if (imagePath) {
    const img = await loadImage(imagePath);

    // Calculate scaling to cover the image area
    const scaleX = IMAGE_WIDTH / img.width;
    const scaleY = HEIGHT / img.height;
    const scale = Math.max(scaleX, scaleY);

    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    // Center crop
    const srcX = (scaledWidth - IMAGE_WIDTH) / 2 / scale;
    const srcY = (scaledHeight - HEIGHT) / 2 / scale;

    ctx.drawImage(
      img,
      srcX, srcY, img.width - srcX * 2, img.height - srcY * 2,
      0, 0, IMAGE_WIDTH, HEIGHT
    );
  } else {
    ctx.fillStyle = post.data.color || '#1a1a2e';
    ctx.fillRect(0, 0, IMAGE_WIDTH, HEIGHT);
  }

  // Gradient transition from image to info section
  const gradient = ctx.createLinearGradient(IMAGE_WIDTH - GRADIENT_WIDTH, 0, IMAGE_WIDTH + 20, 0);
  gradient.addColorStop(0, 'rgba(240, 240, 232, 0)');
  gradient.addColorStop(0.6, 'rgba(240, 240, 232, 0.85)');
  gradient.addColorStop(1, 'rgba(240, 240, 232, 1)');
  ctx.fillStyle = gradient;
  ctx.fillRect(IMAGE_WIDTH - GRADIENT_WIDTH, 0, GRADIENT_WIDTH + 20, HEIGHT);

  // Info section on the right
  const infoY = PADDING;
  const maxTextHeight = HEIGHT - PADDING * 2 - 80;

  // Find optimal font size and wrap title
  const { fontSize, lines } = findFontSize(
    ctx,
    post.data.title,
    INFO_WIDTH,
    maxTextHeight,
    MAX_TITLE_FONT_SIZE,
    MIN_TITLE_FONT_SIZE
  );
  const lineHeight = fontSize * 1.25;

  // Draw title
  ctx.font = `bold ${fontSize}px "Space Grotesk"`;
  ctx.fillStyle = '#000';
  ctx.textBaseline = 'top';

  for (let i = 0; i < lines.length; i++) {
    const y = infoY + i * lineHeight;
    ctx.fillText(lines[i], INFO_X, y);
  }

  // Draw byline and reading time at bottom
  const metaY = HEIGHT - PADDING - 50;
  ctx.font = `bold 18px "Space Grotesk"`;
  ctx.fillStyle = '#000';
  ctx.fillText(`By ${data.profile.name}`, INFO_X, metaY);

  ctx.font = `normal 18px "Space Grotesk"`;
  ctx.fillStyle = '#555';
  ctx.fillText(`${post.readingTime} min read`, INFO_X, metaY + 28);

  // Accent bar
  ctx.fillStyle = post.data.color || '#ffee00';
  ctx.fillRect(INFO_X, metaY + 58, 60, 6);

  const buffer = canvas.toBuffer('image/png');

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'image/png',
    }
  });
};

export { GET, getStaticPaths };
