import { DocumentResult } from '@morten-olsen/goodwrites';
const context = (require as any).context('../content', true, /article\.yml$/)

const getArticles = () => context.keys().map((key: string) => context(key)) as DocumentResult[];

export { getArticles };
