import latex from "node-latex";
import { Readable } from "stream";

const latexToPdf = (doc: string) =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const input = new Readable();
    input.push(doc);
    input.push(null);
    const latexStream = latex(input);
    latexStream.on("data", (chunk) => {
      chunks.push(Buffer.from(chunk));
    });
    latexStream.on("finish", () => {
      const result = Buffer.concat(chunks);
      resolve(result);
    });
    latexStream.on("error", (err) => {
      reject(err);
    });
  });

export { latexToPdf };
