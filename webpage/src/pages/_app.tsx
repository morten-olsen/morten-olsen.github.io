import React, { useMemo } from 'react';
import { createGlobalStyle } from 'styled-components';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '@fontsource/merriweather';
import '@fontsource/pacifico';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/black-ops-one';
import { ThemeProvider } from '../theme/provider';
import { createTheme } from '../theme/create';
import chroma from 'chroma-js';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  h1, h2, h3,h4, h5, h6 {
    margin: 0;
  }

  html, body, body > #__next {
    height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Merriweather', sans-serif;
    background: ${({ theme }) => theme.colors.background};
  }

  a {
    text-decoration: none;
    font-weight: bold;
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  const theme = useMemo(
    () =>
      createTheme({
        baseColor: chroma.random().brighten(1).hex(),
      }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
