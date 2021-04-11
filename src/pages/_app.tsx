import Link from 'next/link';
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components'
import '../styles/main.css';

const GlobalStyle = createGlobalStyle`

  body {
    background: #000;
    color: #fff;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
    font-size: 18px;
    margin: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Comfortaa', c-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
    margin-top: 70px;
  }

  h1 {
    font-size: 3em;
    line-height: 1.2em;
  }

  p {
    padding-bottom: 20px;
    letter-spacing: 1px;
    line-height: 1.6em;
  }

  p::first-letter {
    font-size: 1.3em;
  }

  p + p {
  }
`;

const Header = styled.nav`
  a {
    text-decoration: none;
    color: #3498db;
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: 900px;
  margin: auto;
  padding: 50px;
`;

const App: React.FC<any> = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyle />
      <Header>
        <Content>
          <Link href="/">Home</Link>
        </Content>
      </Header>
      <Content>
        <Component {...pageProps} />
      </Content>
    </>
  );
};

export default App;
