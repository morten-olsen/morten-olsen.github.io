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
  'src/fonts/SpaceGrotesk-Bold.ttf'
);
const fontPathRegular = path.join(
  process.cwd(),
  'src/fonts/SpaceGrotesk-Regular.ttf'
);
safeRegisterFont(fontPathBold, { family: 'Space Grotesk', weight: 'bold' });
safeRegisterFont(fontPathRegular, { family: 'Space Grotesk', weight: 'normal' });

const WIDTH = 1200;
const HEIGHT = 630;
const BORDER_WIDTH = 4;
const SHADOW_OFFSET = 6;
const CONTENT_PADDING = 48;

// Neo-brutalist color palette
const COLORS = ['#00ffff', '#c8ff00', '#ffee00', '#ff6b6b', '#c084fc'];
const BORDER_COLOR = '#000000';

const getStaticPaths = (async () => {
  const posts = await data.posts.getPublished();
  return posts.map((post) => ({
    params: { id: post.id },
    props: {
      heroImagePath: (post.data.heroImage as { fsPath?: string }).fsPath,
    }
  }));
}) satisfies GetStaticPaths;

// Draw a neo-brutalist box with border and shadow
const drawBrutalistBox = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fillColor: string
) => {
  // Shadow
  ctx.fillStyle = BORDER_COLOR;
  ctx.fillRect(x + SHADOW_OFFSET, y + SHADOW_OFFSET, width, height);

  // Border
  ctx.fillStyle = BORDER_COLOR;
  ctx.fillRect(x - BORDER_WIDTH, y - BORDER_WIDTH, width + BORDER_WIDTH * 2, height + BORDER_WIDTH * 2);

  // Fill
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, y, width, height);
};

// Measure word and return box dimensions
const measureWord = (
  ctx: CanvasRenderingContext2D,
  word: string,
  fontSize: number,
  paddingX: number,
  paddingY: number
): { width: number; height: number } => {
  ctx.font = `bold ${fontSize}px "Space Grotesk"`;
  const metrics = ctx.measureText(word);
  return {
    width: metrics.width + paddingX * 2,
    height: fontSize + paddingY * 2
  };
};

// Layout words into rows that fit within maxWidth
const layoutWords = (
  ctx: CanvasRenderingContext2D,
  words: string[],
  fontSize: number,
  paddingX: number,
  paddingY: number,
  maxWidth: number,
  gap: number
): { word: string; x: number; y: number; width: number; height: number; color: string }[][] => {
  const rows: { word: string; x: number; y: number; width: number; height: number; color: string }[][] = [];
  let currentRow: typeof rows[0] = [];
  let currentX = 0;
  let colorIndex = 0;

  for (const word of words) {
    const { width, height } = measureWord(ctx, word, fontSize, paddingX, paddingY);
    const totalWidth = width + SHADOW_OFFSET + BORDER_WIDTH * 2;

    if (currentX + totalWidth > maxWidth && currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [];
      currentX = 0;
    }

    currentRow.push({
      word,
      x: currentX,
      y: 0,
      width,
      height,
      color: COLORS[colorIndex % COLORS.length]
    });

    currentX += totalWidth + gap;
    colorIndex++;
  }

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
};

// Find optimal font size that fits all words
const findOptimalFontSize = (
  ctx: CanvasRenderingContext2D,
  words: string[],
  maxWidth: number,
  maxHeight: number,
  maxFontSize: number,
  minFontSize: number,
  paddingX: number,
  paddingY: number,
  gap: number,
  rowGap: number
): number => {
  for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 2) {
    const rows = layoutWords(ctx, words, fontSize, paddingX, paddingY, maxWidth, gap);
    const rowHeight = fontSize + paddingY * 2 + SHADOW_OFFSET + BORDER_WIDTH * 2;
    const totalHeight = rows.length * rowHeight + (rows.length - 1) * rowGap;

    if (totalHeight <= maxHeight) {
      return fontSize;
    }
  }
  return minFontSize;
};

const GET = async (context: APIContext<{ heroImagePath?: string }, { id: string }>) => {
  const { id } = context.params;
  const { heroImagePath: propsImagePath } = context.props;
  const post = await data.posts.get(id);

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Load and draw hero image edge-to-edge
  const heroImage = post.data.heroImage as { fsPath?: string; src?: string };
  let imagePath = propsImagePath ?? heroImage.fsPath;

  if (!imagePath && heroImage.src) {
    const src = heroImage.src.split('?')[0];
    if (src.startsWith('/@fs')) {
      imagePath = src.replace('/@fs', '');
    } else if (src.startsWith('/src/')) {
      imagePath = path.join(process.cwd(), src);
    }
  }

  let imageLoaded = false;
  if (imagePath) {
    try {
      const img = await loadImage(imagePath);
      imageLoaded = true;

      // Calculate scaling to cover the entire canvas
      const scaleX = WIDTH / img.width;
      const scaleY = HEIGHT / img.height;
      const scale = Math.max(scaleX, scaleY);

      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      const srcX = (scaledWidth - WIDTH) / 2 / scale;
      const srcY = (scaledHeight - HEIGHT) / 2 / scale;

      ctx.drawImage(
        img,
        srcX, srcY, img.width - srcX * 2, img.height - srcY * 2,
        0, 0, WIDTH, HEIGHT
      );
    } catch {
      // Image failed to load
    }
  }

  if (!imageLoaded) {
    ctx.fillStyle = post.data.color || '#1a1a2e';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  // Gradient overlay from bottom for text readability
  const gradient = ctx.createLinearGradient(0, HEIGHT * 0.15, 0, HEIGHT);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.5)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Title section - positioned at bottom (extra right margin for shadow)
  const titleMaxWidth = WIDTH - CONTENT_PADDING * 2 - SHADOW_OFFSET - BORDER_WIDTH;
  const paddingX = 16;
  const paddingY = 8;
  const gap = 12;
  const rowGap = 8;

  const words = post.data.title.toUpperCase().split(' ');

  // Calculate title layout to position from bottom
  const fontSize = findOptimalFontSize(
    ctx, words, titleMaxWidth, 200,
    48, 28, paddingX, paddingY, gap, rowGap
  );

  const rows = layoutWords(ctx, words, fontSize, paddingX, paddingY, titleMaxWidth, gap);
  const rowHeight = fontSize + paddingY * 2 + SHADOW_OFFSET + BORDER_WIDTH * 2;
  const totalTitleHeight = rows.length * rowHeight + (rows.length - 1) * rowGap;

  // Position title above the meta info
  const metaHeight = 32 + SHADOW_OFFSET + BORDER_WIDTH * 2;
  const titleY = HEIGHT - CONTENT_PADDING - metaHeight - 24 - totalTitleHeight;

  ctx.textBaseline = 'middle';

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    const rowY = titleY + rowIndex * (rowHeight + rowGap);

    for (const box of row) {
      const boxX = CONTENT_PADDING + box.x;
      const boxY = rowY;

      drawBrutalistBox(ctx, boxX, boxY, box.width, box.height, box.color);

      // Draw text
      ctx.font = `bold ${fontSize}px "Space Grotesk"`;
      ctx.fillStyle = BORDER_COLOR;
      ctx.fillText(box.word, boxX + paddingX, boxY + box.height / 2 + 2);
    }
  }

  // Author info at bottom left
  const metaY = HEIGHT - CONTENT_PADDING - 16;
  ctx.font = `bold 18px "Space Grotesk"`;
  ctx.fillStyle = BORDER_COLOR;
  ctx.textBaseline = 'middle';

  const authorText = `BY ${data.profile.name.toUpperCase()}`;
  const readTimeText = `${post.readingTime} MIN READ`;

  const authorMetrics = ctx.measureText(authorText);
  const readTimeMetrics = ctx.measureText(readTimeText);

  // Draw author box
  const authorBoxWidth = authorMetrics.width + 24;
  const authorBoxHeight = 32;
  const authorBoxX = CONTENT_PADDING;
  const authorBoxY = metaY - authorBoxHeight / 2;

  drawBrutalistBox(ctx, authorBoxX, authorBoxY, authorBoxWidth, authorBoxHeight, '#ffffff');
  ctx.fillStyle = BORDER_COLOR;
  ctx.fillText(authorText, authorBoxX + 12, authorBoxY + authorBoxHeight / 2 + 1);

  // Draw reading time box to the right
  const readTimeBoxWidth = readTimeMetrics.width + 24;
  const readTimeBoxX = authorBoxX + authorBoxWidth + SHADOW_OFFSET + BORDER_WIDTH * 2 + gap;

  drawBrutalistBox(ctx, readTimeBoxX, authorBoxY, readTimeBoxWidth, authorBoxHeight, '#ffffff');
  ctx.fillStyle = BORDER_COLOR;
  ctx.fillText(readTimeText, readTimeBoxX + 12, authorBoxY + authorBoxHeight / 2 + 1);

  const buffer = canvas.toBuffer('image/png');

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'image/png',
    }
  });
};

export { GET, getStaticPaths };
