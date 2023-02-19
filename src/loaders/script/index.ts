import { Loader } from "../../bundler";
import { rollup } from 'rollup';
import terser from '@rollup/plugin-terser';
import sucrase from '@rollup/plugin-sucrase';
import resolve from '@rollup/plugin-node-resolve';
import { createHash } from "crypto";

type ScriptOptions = {
  entry: string;
}

const scriptLoader = ({
  entry,
}: ScriptOptions): Loader<Promise<string>> => async ({
  bundler,
}) => {
  const bundle = await rollup({
    input: entry,
    plugins: [
      resolve(),
      sucrase({
        transforms: ['typescript'],
      }),
      terser(),
    ],
  });

  const { output } = await bundle.generate({
    format: 'iife',
  });

  const [chunk] = output;
  const { code } = chunk;
  const hash = createHash('sha256').update(code).digest('hex').substring(0, 12);
  const path = `scripts/${hash}.js`;

  return bundler.add({
    path,
    content: code,
  });
}

export { scriptLoader };
