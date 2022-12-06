type Position = {
  body: string;
  attributes: {
    start: number;
    end?: number;
    company: string;
    title: string;
  };
};

export type { Position };
