
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

const resizeGenerator: ImageGenerator = async (data, location, canvas) => {
  const dir = path.dirname(location);
  const src = path.join(dir, data.src);
  Container.set(AssetResolver, assets)
  const ctx = canvas.getContext('2d');
  ctx.antialias = 'subpixel';
  const cover = await loadImage(src);
  drawImageProp(
    ctx,
    cover,
  )
};

export { resizeGenerator };
