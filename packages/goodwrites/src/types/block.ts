type TimeTarget = {
  minutes: number;
  seconds: number;
};

type WordTarget = {
  words: number;
};

type LengthTarget = TimeTarget | WordTarget;

type BaseBlock = {
  type?: string;
  title?: string;
  lenght?: LengthTarget;
  notes?: string;
  state?: 'placeholder' | 'first-draft' | 'revisions' | 'final-draft' | 'final';
};

type FileBlock = BaseBlock & {
  file: string;
};

type BlocksBlock = BaseBlock & {
  content: Block[];
};

type Block = string | FileBlock | BlocksBlock;

export type {
  Block,
  BlocksBlock,
  FileBlock,
  LengthTarget,
  TimeTarget,
  WordTarget,
};
