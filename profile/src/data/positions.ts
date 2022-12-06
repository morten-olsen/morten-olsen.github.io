import { Position } from "../types/positions";

const context = (require as any).context('../../positions', true, /\.md$/)

const getPositions = () => context.keys().map((key: string) => context(key)).map((a: any) => ({
  ...a,
  attributes: {
    ...a.attributes,
    start: a.attributes.start ? new Date(a.attributes.start).getTime() : null,
    end: a.attributes.end ? new Date(a.attributes.end).getTime() : null,
  },
})) as Position[];

export { getPositions };
