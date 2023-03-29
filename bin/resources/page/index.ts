import React, { ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HelmetProvider, FilledContext } from 'react-helmet-async';
import { Asset, Bundler } from '../../bundler';
import { Observable } from '../../observable';
import { ServerStyleSheet } from 'styled-components';
import { resolve } from 'path';
import { createScript } from '../script';

type PageOptions = {
  path: string;
  template: Observable<ComponentType<any>>;
  props: Observable<any>;
  bundler: Bundler;
};

let devClientUrl: string | undefined;

const createPage = (options: PageOptions) => {
  const data = Observable.combine({
    template: options.template,
    props: options.props,
  });
  if (devClientUrl === undefined) {
    const devClient = createScript({
      path: resolve(__dirname, 'client.ts'),
      format: 'iife',
    });
    const devClientAsset = devClient.pipe<Asset>(async () => {
      const script = await devClient.data;
      return {
        content: script,
      };
    });
    const devClientBundle = options.bundler.register('/dev-client.js', devClientAsset);
    devClientUrl = devClientBundle;
  }
  const page = data.pipe(async ({ template, props }) => {
    const sheet = new ServerStyleSheet();
    const helmetContext: FilledContext = {} as any;
    const body = sheet.collectStyles(
      React.createElement(
        HelmetProvider,
        { context: helmetContext },
        React.createElement(template, props),
      ),
    );
    const bodyHtml = renderToStaticMarkup(body);
    const { helmet } = helmetContext;

    const css = sheet.getStyleTags();
    const headHtml = [
      css,
      `<script src="${devClientUrl}"></script>`,
      helmet.title?.toString(),
      helmet.priority?.toString(),
      helmet.meta?.toString(),
      helmet.link?.toString(),
      helmet.script?.toString(),
    ]
      .filter(Boolean)
      .join('');
    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    ${headHtml}
  </head>
  <body>
    ${bodyHtml}
  </body>
</html>
  `;
    const asset: Asset = { content: html };
    return asset;
  });

  const path = resolve('/', options.path, 'index.html');
  return options.bundler.register(path, page);
};

export { createPage };
