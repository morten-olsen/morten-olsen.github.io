import { resolve } from "path";
import { Bundler } from "./bundler";
import { Articles } from "./data/articles";

const createContext = async (bundler: Bundler) => {
  const articleDB = new Articles({
    cwd: resolve(__dirname, '../content/articles'),
    pattern: '*/main.md',
    bundler,
  });

  const articles = await articleDB.getAll();

  return {
    articles,
  };
}

type Context = ReturnType<typeof createContext> extends Promise<infer T> ? T : never

export type { Context };
export { createContext };
