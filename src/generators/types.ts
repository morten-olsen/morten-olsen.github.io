export type Generator<TData = any> = (data: TData, location: string) => Promise<{
  [key: string]: {
    name: string;
    content: string | Buffer;
  }
}>;

