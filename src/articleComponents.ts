const sharedComponentContext = (require as any).context(
  './components/shared',
  true,
  /\.comp.tsx?$/,
);

const articleComponentContext = (require as any).context(
  './articles',
  true,
  /\.comp.tsx?$/,
);

const shared = sharedComponentContext.keys().reduce((output: any, key: string) => {
  const component = sharedComponentContext(key).default;
  const name = component.compName;
  return {
    ...output,
    [name]: component,
  };
}, {});

const articles = articleComponentContext.keys().reduce((output: any, key: string) => {
  const component = articleComponentContext(key).default;
  const [, owner] = key.split('/');
  const name = component.compName;
  return {
    ...output,
    [owner]: {
      ...output[owner],
      [name]: component,
    },
  };
}, {});

const create = (name: string) => {
  const article = articles[name];
  return {
    ...shared,
    ...article,
  };
};

export default create;
