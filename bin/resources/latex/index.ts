import { Asset, Bundler } from "../../bundler";
import { Observable } from "../../observable";
import { createEjs } from "../ejs";
import { latexToPdf } from "./utils";

type LatexOptions = {
  path: string;
  bundler: Bundler;
  template: ReturnType<typeof createEjs>;
  data: Observable<any>;
};
const createLatex = ({ template, data, path, bundler }: LatexOptions) => {
  const pdf = Observable.combine({
    template,
    data,
  })
    .pipe(async ({ template, data }) => template(data))
    .pipe(async (latex) => {
      const pdf = await latexToPdf(latex);

      const asset: Asset = {
        content: pdf,
      };
      return asset;
    });
  return bundler.register(`${path}.pdf`, pdf);
};

export { createLatex };
