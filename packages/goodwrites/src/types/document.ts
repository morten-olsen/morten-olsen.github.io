import { Block } from './block';

type Document = {
  title: string;
  cover?: string;
  meta?: any;
  content: Block | Block[];
};

export type { Document };
