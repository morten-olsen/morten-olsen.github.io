export type GeneratorOptions<TData> = {
  data: TData;
  location: string;
  isDev: boolean;
  addDependency: (file: string) => void;
};
export type Generator<TData = any> = (options: GeneratorOptions<TData>) => Promise<{
  [key: string]: {
    name: string;
    isStatic?: boolean;
    content: string | Buffer;
  }
}>;

