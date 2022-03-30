import { loadImage, CanvasRenderingContext2D, Image, createCanvas } from 'canvas';
import path from 'path';
import Container from "typedi";
import { AssetResolver } from "../../../data/assets";
import { ArticleDB } from "../../../data/repos/articles";
import { ImageGenerator } from "./types";
import { ProfileDB } from '../../../data/repos/profile';

const assets = {
  getPath: (...source: string[]) => {
    return path.join(process.cwd(), 'content', ...source);
  },
}

function drawImageProp(
  ctx: CanvasRenderingContext2D,
  img: Image,
  x?: number,
  y?: number,
  w?: number,
  h?: number,
  offsetX?: number,
  offsetY?: number,
) {

    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    // default offset is center
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,   // new prop. width
        nh = ih * r,   // new prop. height
        cx, cy, cw, ch, ar = 1;

    // decide which gap to fill    
    if (nw < w) ar = w / nw;                             
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
}

const shareGenerator: ImageGenerator = async (data, location, canvas) => {
  const dir = path.dirname(location);
  const id = path.basename(dir);
  Container.set(AssetResolver, assets)
  const articleDB = Container.get(ArticleDB);
  const profileDB = Container.get(ProfileDB);
  const article = await articleDB.get(id);
  const profile = await profileDB.get();
  const ctx = canvas.getContext('2d');
  ctx.antialias = 'subpixel';
  const cover = await loadImage(article.cover);
  drawImageProp(
    ctx,
    cover,
  )
  const author = `by ${profile.name}`;
  ctx.font = '30px sans';
  const titleSize = ctx.measureText(article.title);

  ctx.font = '16px sans';
  const authorSize = ctx.measureText(author);
  const titleHeight = titleSize.actualBoundingBoxDescent + titleSize.actualBoundingBoxAscent;
  const authorHeight = authorSize.actualBoundingBoxDescent + authorSize.actualBoundingBoxAscent;

  const offset = 10;
  ctx.fillStyle = '#222';
  ctx.fillRect(
    20, 
    offset,
    Math.min(canvas.width - 60, titleSize.width + 20),
    titleHeight + 20,
  )

  const authorOffset = offset + titleHeight + 20 + 20;

  ctx.fillRect(
    20, 
    authorOffset,
    Math.min(canvas.width - 60, authorSize.width + 20),
    authorHeight + 20,
  )
  ctx.fillStyle = '#fff';
  ctx.font = '30px sans';
  ctx.fillText(
    article.title,
    30,
    30 + titleSize.actualBoundingBoxAscent / 2,
  )

  ctx.font = '16px sans';
  ctx.fillText(
    author,
    30,
    authorOffset + 10 + authorSize.actualBoundingBoxAscent / 2,
  )
};

export { shareGenerator };
