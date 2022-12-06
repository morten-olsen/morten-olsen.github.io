import { getArticles } from '@morten-olsen/personal-webpage-articles';
import { GetStaticPaths, GetStaticProps } from 'next';
import styled from 'styled-components';
import React from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { Jumbo, Overline } from 'typography';

type Props = {
  article: ReturnType<typeof getArticles>[number];
};

const Wrapper = styled.div``;

const ArticleWrapper = styled.article`
  margin-right: 40%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;

  @media only screen and (max-width: 700px) {
    margin-right: 0;
  }
`;

const ArticleContent = styled.div`
  max-width: 900px;
  padding: 50px;
  letter-spacing: 0.5px;
  line-height: 2.1rem;
  color: ${({ theme }) => theme.colors.foreground};

  img {
    max-width: 100%;
  }

  p:first-of-type::first-letter {
    font-size: 6rem;
    float: left;
    padding: 1rem;
    margin: 0px 2rem;
    font-weight: 100;
    margin-left: 0rem;
  }

  p + p::first-letter {
    margin-left: 1.8rem;
  }

  p {
    margin-left: 50px;
    @media only screen and (max-width: 700px) {
      margin-left: 0;
    }
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.foreground};
    padding: 0.2rem 0.4rem;
  }

  h2,
  h3,
  h4,
  h5,
  h6 {
    display: inline-block;
    padding: 15px;
    text-transform: uppercase;
    margin: 5px 0;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.foreground};

    @media only screen and (max-width: 700px) {
      background: transparent;
      padding: 0;
    }
  }
`;

const AsideWrapper = styled.aside<{
  image?: string;
}>`
  width: 40%;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.primary};
  background-size: cover;
  background-position: center;
  opacity: 0.5;
  ${({ image }) => (image ? `background-image: url(${image});` : '')}

  @media only screen and (max-width: 700px) {
    position: static;
    width: 100%;
    opacity: 1;
    height: 200px;
  }
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
  margin: 5px;

  @media only screen and (max-width: 700px) {
    font-size: 2rem;
    line-height: 2.1rem;
  }
`;

const Meta = styled(Overline)`
  font-size: 0.8rem;
`;

const Article: React.FC<Props> = ({ article }) => {
  return (
    <Wrapper>
      <ArticleWrapper>
        <ArticleContent>
          {article.title.split(' ').map((word, index) => (
            <Title key={index}>{word}</Title>
          ))}
          <div>
            <Meta>
              By Morten Olsen - 5 min read{' '}
              {article.pdf && (
                <a href={article.pdf} target="_blank">
                  download as PDF
                </a>
              )}
            </Meta>
          </div>
          <AsideWrapper image={article.cover} />
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </ArticleContent>
      </ArticleWrapper>
    </Wrapper>
  );
};

const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { slug } = context.params;
  const articles = getArticles();
  const article = articles.find((a) => a.meta.slug === slug);

  return {
    props: {
      article,
    },
  };
};

const getStaticPaths: GetStaticPaths = async () => {
  const articles = getArticles();
  return {
    paths: articles.map((a) => ({
      params: { slug: a.meta?.slug ?? a.title },
    })),
    fallback: false,
  };
};

export { getStaticPaths, getStaticProps };
export default Article;
