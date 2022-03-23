import React from 'react';
import { createGlobalStyle } from 'styled-components';
import type { AppProps } from 'next/app'
import Head from 'next/head';
import "@fontsource/merriweather";
import "@fontsource/pacifico";
import "@fontsource/fredoka";
import { Transition } from '../components/animations/transition';

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
  }

  a {
    text-decoration: none;
    color: #3498db;
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Transition>
        <Component {...pageProps} />
      </Transition>
    </>
  );
};

