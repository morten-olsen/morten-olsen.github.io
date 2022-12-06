import React, { FC } from 'react';
import '@fontsource/merriweather/index.css';
import styled, { createGlobalStyle } from 'styled-components';
import { Block } from './components/block';
import { useDoc } from './features/doc';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';

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
    background: #fff;
    width: 100%;
    max-width: 800px;
    margin: auto;
    font-family: 'Merriweather', sans-serif;
  }
  a {
    text-decoration: none;
    color: #3498db;
  }
`;

const Cover = styled.img`
  max-width: 100%;
`;

const Title = styled.h1`
  font-size: 3rem;
  line-height: 3.8rem;
  margin-bottom: 0px;
`;

const App: FC = () => {
  const doc = useDoc();
  return (
    <div>
      <GlobalStyle />
      <Title>{doc.title}</Title>
      <Cover src={doc.cover} />
      <Document file={doc.pdf}>
        <Page pageNumber={1} renderTextLayer={false} />
      </Document>
      {doc.parts.map((part, index) => (
        <Block key={index} block={part} doc={doc} />
      ))}
      <a href={(doc as any).pdf}>PDF {(doc as any).pdf}</a>
    </div>
  );
};

export { App };
