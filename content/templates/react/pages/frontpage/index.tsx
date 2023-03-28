import styled, { createGlobalStyle } from 'styled-components';
import { ArticleGrid } from '@/components/article/grid';
import { Jumbo } from '@/typography';
import { useMemo } from 'react';
import { Sheet } from '../../components/sheet';
import { ThemeProvider, createTheme } from '@/theme';
import chroma from 'chroma-js';
import { Helmet } from 'react-helmet-async';
import { Page } from 'types';

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  body, html { height: 100%; margin: 0; }
  body {
    font-size: 17px;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.foreground};
  }
`;

const Hero = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Download = styled.a`
  font-size: 30px;
  line-height: 40px;
  display: inline-block;
  background: ${({ theme }) => theme.colors.foreground};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 15px;
  text-transform: uppercase;
  margin: 10px;
  font-family: 'Black Ops One', sans-serif;
  @media only screen and (max-width: 700px) {
    margin: 5px;
    font-size: 3rem;
    line-height: 3.1rem;
  }
`;

const Title = styled(Jumbo)`
  font-size: 60px;
  line-height: 80px;
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.foreground};
  padding: 0 15px;
  text-transform: uppercase;
  margin: 10px;
  font-family: 'Black Ops One', sans-serif;
  @media only screen and (max-width: 700px) {
    margin: 5px;
    font-size: 3rem;
    line-height: 3.1rem;
  }
`;

const Arrow = styled.div`
  position: absolute;
  bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  :after {
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    width: 80px;
    height: 80px;
    content: '↓';
    font-size: 50px;
    @media only screen and (max-width: 700px) {
      width: 40px;
      height: 40px;
    }
  }
`;

const ImageBg = styled.picture`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: -1;
  opacity: 0.5;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const FrontPage: Page<'frontpage'> = ({ articles, profile }) => {
  const theme = useMemo(
    () =>
      createTheme({
        baseColor: chroma.random().brighten(1).hex(),
      }),
    [],
  );

  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Black+Ops+One&family=Merriweather:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <GlobalStyle />
      <Sheet color="#c85279">
        <ImageBg>
          <img src={profile.imageUrl} loading="lazy" />
        </ImageBg>
        <Arrow />
        <Hero>
          {"Hi, I'm Morten".split(' ').map((char, index) => (
            <Title key={index}>{char}</Title>
          ))}
        </Hero>
        <Hero>
          {'And I make software'.split(' ').map((char, index) => (
            <Title key={index}>{char}</Title>
          ))}
        </Hero>
        <Hero>
          <Download href="/resume.pdf" download>
            Download resumé
          </Download>
        </Hero>
      </Sheet>
      <Sheet color="#ef23e2">
        <Hero>
          {'Table of Content'.split(' ').map((char, index) => (
            <Title key={index}>{char}</Title>
          ))}
        </Hero>
        <ArticleGrid articles={articles} />
      </Sheet>
    </ThemeProvider>
  );
};

export default FrontPage;
