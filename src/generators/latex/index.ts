import latex from 'node-latex';
import { Readable } from 'stream';
import { Generator } from '../types';
import { generators } from "./generators";

const latexToPdf = (doc: string) => new Promise<Buffer>((resolve, reject) => {
  const chunks = [];
  const input = new Readable();
  input.push(doc);
  input.push(null);
  const latexStream = latex(input);
  latexStream.on('data', (chunk) => {
    chunks.push(Buffer.from(chunk));
  })
  latexStream.on('finish', () => {
    const result = Buffer.concat(chunks);
    resolve(result);
  })
  latexStream.on('error', (err) => {
    reject(err);
  })
});

const generateLatex: Generator = async ({
  data,
  location,
}) => {
  const { type, ...rest } = data; 
  const generator = generators[type];
  const doc = await generator(rest, location);
  const content = await latexToPdf(doc);
  return {
    default: {
      name: 'doc.pdf',
      content,
    }
  };
}

export { generateLatex };
