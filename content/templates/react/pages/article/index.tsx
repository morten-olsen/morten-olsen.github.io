import styled, { createGlobalStyle, keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Jumbo } from '../../typography';
import { createTheme, ThemeProvider } from '../../theme';
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
  /* latin-ext */
@font-face {
  font-family: 'Archivo Black';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/archivoblack/v17/HTxqL289NzCGg4MzN6KJ7eW6CYKF_i7y.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Archivo Black';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/archivoblack/v17/HTxqL289NzCGg4MzN6KJ7eW6CYyF_g.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Black Ops One';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/blackopsone/v20/qWcsB6-ypo7xBdr6Xshe96H3aDbbtwkh.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* vietnamese */
@font-face {
  font-family: 'Black Ops One';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/blackopsone/v20/qWcsB6-ypo7xBdr6Xshe96H3aDTbtwkh.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Black Ops One';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/blackopsone/v20/qWcsB6-ypo7xBdr6Xshe96H3aDXbtwkh.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Black Ops One';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/blackopsone/v20/qWcsB6-ypo7xBdr6Xshe96H3aDvbtw.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Merriweather';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-cSZMZ-Y.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Merriweather';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-eCZMZ-Y.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* vietnamese */
@font-face {
  font-family: 'Merriweather';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-cyZMZ-Y.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Merriweather';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-ciZMZ-Y.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Merriweather';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-fCZM.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Merriweather';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhSvowK_l52xwNZVcf6lvg.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Merriweather';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhSvowK_l52xwNZXMf6lvg.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* vietnamese */
@font-face {
  font-family: 'Merriweather';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhSvowK_l52xwNZV8f6lvg.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Merriweather';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhSvowK_l52xwNZVsf6lvg.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Merriweather';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhSvowK_l52xwNZWMf6.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

`;

const TitleAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

const Title = styled(Jumbo)`
  display: block;
  padding: 5rem 2rem;
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  min-height: 100%;
  margin-bottom: 10rem;
  margin-top: 10rem;
  animation: ${TitleAnimation} 0.4s ease-in-out;
  @media only screen and (max-width: 900px) {
    z-index: 1;
    padding-bottom: 2rem;
  }
`;

const ArticleTitleWord = styled(Jumbo)`
  font-size: 4rem;
  line-height: 4.1rem;
  display: inline-block;
  padding: 0 15px;
  text-transform: uppercase;
  margin: 10px;
  font-family: 'Black Ops One', sans-serif;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.foreground};
  @media only screen and (max-width: 900px) {
    z-index: 1;
    font-size: 2.5rem;
    line-height: 3.1rem;
  }
  @media only screen and (max-width: 700px) {
    padding: 5px;
    font-size: 2rem;
    line-height: 2.1rem;
  }
`;

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`;

const ArticleAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

const ArticleWrapper = styled.article`
  font-size: 1.1rem;
  font-family: 'Merriweather', serif;
  animation: ${ArticleAnimation} 0.5s ease-in-out;

  > p,
  ul,
  ol {
    letter-spacing: 0.08rem;
    line-height: 2.1rem;
    text-align: justify;
    max-width: 700px;
    margin: 2rem 4rem;
    list-style-position: inside;
    background: ${({ theme }) => theme.colors.background};

    @media only screen and (max-width: 700px) {
      margin: 2rem 2rem;
    }
  }

  > p:first-of-type {
    display: block;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
  }

  > p:first-of-type::first-letter {
    font-family: 'Black Ops One', sans-serif;
    border: solid 5px ${({ theme }) => theme.colors.foreground};
    margin: 0 1rem 0 0;
    font-size: 6rem;
    float: left;
    clear: left;
    padding: 1rem;
  }

  li {
    padding: 0.5rem 0;
    margin: 0;
  }

  img {
    max-width: 100%;
    margin: auto;
  }

  > p + p::first-letter {
    margin-left: 1.8rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    max-width: 350px;
    margin-left: -100px;
    float: left;
    padding: 20px;
    padding-right: 40px;
    shape-outside: padding-box;
    position: relative;
    font-family: 'Black Ops One', sans-serif;
    text-transform: uppercase;
    display: flex;
    align-items: flex-start;

    @media only screen and (max-width: 900px) {
      width: 100%;
      margin-left: 0;
      shape-outside: inherit;
      float: none;
    }

    &:after {
      position: absolute;
      content: '';
      right: 20px;
      top: 0;
      bottom: 0;
      border: solid 5px ${({ theme }) => theme.colors.foreground};
      left: 0;

      @media only screen and (max-width: 900px) {
        border: none;
      }
    }
  }

  blockquote {
    width: 350px;
    font-size: 3rem;
    margin-left: -100px;
    float: left;
    padding: 50px;
    shape-outside: padding-box;
    position: relative;
    text-transform: uppercase;

    @media only screen and (max-width: 900px) {
      width: 100%;
      margin-left: 0;
    }

    &:before {
      color: ${({ theme }) => theme.colors.primary};
      content: '\\00BB';
      float: left;
      font-size: 6rem;
    }

    &:after {
      position: absolute;
      content: '';
      right: 20px;
      top: 0;
      bottom: 0;
      border-right: 5px solid;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Content = styled.div`
  margin-right: 40%;
  max-width: 700px;
  width: 100%;
  position: absolute;
  right: 0;

  @media only screen and (max-width: 900px) {
    margin-right: 0;
  }
`;

const SideAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
`;

const Side = styled.aside`
  position: fixed;
  right: 0;
  top: 0;
  width: 40%;
  height: 100%;
  clip-path: polygon(40% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%);
  animation ${SideAnimation} 0.3s ease-in-out forwards;

  @media only screen and (max-width: 900px) {
    position: static;
    width: 100%;
    height: 350px;
    clip-path: none;
  }
`;

const Cover = styled.div<{ src: string }>`
  background: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
`;

const Download = styled.a`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.foreground};
  text-align: center;
  padding: 1rem;
  font-size: 1rem;
  font-family: 'Black Ops One', sans-serif;
  text-transform: uppercase;
  text-decoration: none;
`;

const Author = styled.a`
  text-transform: uppercase;
  font-family: 'Black Ops One', sans-serif;
  font-size: 2rem;
  margin: 1rem;
  display: inline-block;
  position: relative;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.foreground};

  &:after {
    content: '';
    border-bottom: solid 15px ${({ theme }) => theme.colors.primary};
    display: block;
    width: 100%;
    height: 5px;
    bottom: 0px;
    z-index: -1;
    position: absolute;
  }
`;

const ArticlePage: Page<'article'> = ({ article, profile, pdfUrl }) => {
  return (
    <ThemeProvider theme={createTheme({ baseColor: article.color })}>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <title>
          {article.title} by {profile.name}
        </title>
      </Helmet>
      <GlobalStyle />
      <Wrapper>
        <Content>
          <Title>
            {article.title.split(' ').map((word, index) => (
              <ArticleTitleWord key={index}>{word}</ArticleTitleWord>
            ))}
            <Author href="/">by {profile.name}</Author>
          </Title>
          <Download href={pdfUrl} target="_blank" rel="noreferrer">
            Download PDF
          </Download>
          <ArticleWrapper>
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </ArticleWrapper>
        </Content>
        <Side>
          <Cover src={article.coverUrl} />
        </Side>
      </Wrapper>
    </ThemeProvider>
  );
};

export default ArticlePage;
