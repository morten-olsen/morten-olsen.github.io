import { renderToStaticMarkup } from 'react-dom/server';
import { ComponentType, ReactNode } from "react"
import { Loader } from "../../bundler";
import { DataContext, createUseDataContext } from "./data";
import { Html } from "./defaults/html";
import { ServerStyleSheet } from 'styled-components';

type ReactLoaderOptions<TProps extends any> = {
  path: string;
  component: ComponentType<TProps>;
  context?: any;
  props: TProps;
}

type HtmlComponentProps = {
  body: ReactNode;
  head: ReactNode;
}

type CreateReactLoaderOptions<TProps extends any> = {
  component: ComponentType<TProps & HtmlComponentProps>;
  props: TProps;
  context?: any;
}

const createReactLoader = <TLoaderOptions = any>(
  loaderOptions: CreateReactLoaderOptions<TLoaderOptions>
) => <TProps = any>(
  contentOptions: ReactLoaderOptions<TProps>
): Loader<string> => ({
  bundler,
}) => {
  const ContentComponent = contentOptions.component;
  const sheet = new ServerStyleSheet();
  const bodyElement = (
    <DataContext.Provider value={{...loaderOptions.context, ...contentOptions.context}}>
      <ContentComponent {...contentOptions.props as any} />
    </DataContext.Provider>
  );
  const bodyElementWithStyle = sheet.collectStyles(bodyElement);
  const bodyHtml = renderToStaticMarkup(bodyElementWithStyle);
  const styles = sheet.getStyleElement();
  sheet.seal();
  const htmlElement = (
    <DataContext.Provider value={{...loaderOptions.context}}>
      <loaderOptions.component
        {...loaderOptions.props}
        head={(
          <>
            {styles}
          </>
        )}
        body={<div id="root" dangerouslySetInnerHTML={{ __html: bodyHtml}} />}
      />
    </DataContext.Provider>
  )
  const content = renderToStaticMarkup(htmlElement);
  return bundler.add({
    path: contentOptions.path,
    content,
  });
}

const reactLoader = createReactLoader({
  component: Html,
  props: {},
});

export { reactLoader, createReactLoader, createUseDataContext };
