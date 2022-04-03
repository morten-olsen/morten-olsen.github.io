import { Generator } from '../types';
import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';
import puppeteer from 'puppeteer';

const generateImage = async (html: string, width: number, height: number) => {
  const browser = await puppeteer.launch({
     args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width,
    height,
  })
  await page.setContent(html);
  const image = await page.screenshot();
  return image;
}

export const generateHtmlImage: Generator = async ({
  data,
  location,
  isDev,
  addDependency,
}) => {
  const { template, name, width, height, ...rest } = data;
  const dir = path.dirname(location);
  const getAsset = (a: string) => {
    const target = path.resolve(dir, a);
    const content = fs.readFileSync(target);
    addDependency(target);
    const base64File = Buffer.from(content).toString('base64');
    return `data:image/png;base64,${base64File}`;
  };
  const templateLocation = path.resolve(dir, template);
  addDependency(templateLocation);
  const templateContent = await fs.readFile(templateLocation, 'utf-8');
  const html = ejs.render(templateContent, {
    ...rest,
    getAsset,
  });
  const content = isDev ? html : await generateImage(html, width, height);
  return {
    default: {
      name: isDev ? `${name}.html` : `${name}.png`,
      isStatic: true,
      content: Array.isArray(content) ? content[0] : content,
    }
  };
}
