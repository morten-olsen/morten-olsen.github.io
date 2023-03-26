import styled, { createGlobalStyle } from "styled-components";
import ReactMarkdown from "react-markdown";
import { Jumbo } from "./typography";
import { createTheme, ThemeProvider } from "./theme";
import { Helmet } from "react-helmet-async";
import { Page } from "types";

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  body, html { height: 100%; margin: 0; }
  body {
    font-size: 17px;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.foreground};
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
  @media only screen and (max-width: 900px) {
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
  font-family: "Black Ops One", sans-serif;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.foreground};
  @media only screen and (max-width: 900px) {
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

const ArticleWrapper = styled.article`
  font-size: 1.1rem;
  font-family: "Merriweather", serif;

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
    font-family: "Black Ops One", sans-serif;
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
    font-family: "Black Ops One", sans-serif;
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
      content: "";
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
      content: "\\00BB";
      float: left;
      font-size: 6rem;
    }

    &:after {
      position: absolute;
      content: "";
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

const Side = styled.aside`
  position: fixed;
  right: 0;
  top: 0;
  width: 40%;
  height: 100%;
  clip-path: polygon(40% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%);

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
  font-family: "Black Ops One", sans-serif;
  text-transform: uppercase;
  text-decoration: none;
`;

const Author = styled.a`
  text-transform: uppercase;
  font-family: "Black Ops One", sans-serif;
  font-size: 2rem;
  margin: 1rem;
  display: inline-block;
  position: relative;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.foreground};

  &:after {
    content: "";
    border-bottom: solid 15px ${({ theme }) => theme.colors.primary};
    display: block;
    width: 100%;
    height: 5px;
    bottom: 0px;
    z-index: -1;
    position: absolute;
  }
`;

const ArticlePage: Page<"article"> = ({ article, profile, pdfUrl }) => {
  return (
    <ThemeProvider theme={createTheme({ baseColor: article.color })}>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Black+Ops+One&family=Merriweather:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <GlobalStyle />
      <Wrapper>
        <Content>
          <Title>
            {article.title.split(" ").map((word, index) => (
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
