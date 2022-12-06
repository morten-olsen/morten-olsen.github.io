import React, { FC } from 'react';
import styled from 'styled-components';
import { Jumbo } from 'typography';
import { getArticles } from '@morten-olsen/personal-webpage-articles/dist/index';
import { GetStaticProps } from 'next';
import { getPositions, Position } from '@morten-olsen/personal-webpage-profile';
import { Sheet } from '../components/sheet';
import ArticlePreview from 'components/articles/preview';

type Props = {
  articles: ReturnType<typeof getArticles>;
  positions: Position[];
};

const Hero = styled.div`
  display: flex;
  flex-wrap: wrap;
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

const ArticleList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;

const Index: FC<Props> = ({ articles, positions }) => {
  return (
    <>
      <Sheet backgroundColor="red">
        <Hero>
          {"Hi, I'm Morten Olsen".split(' ').map((char, index) => (
            <Title key={index}>{char}</Title>
          ))}
        </Hero>
        <Hero>
          {'And I make software'.split(' ').map((char, index) => (
            <Title key={index}>{char}</Title>
          ))}
        </Hero>
      </Sheet>
      <Sheet backgroundColor="#273c75">
        <h2>Articles</h2>
        <ArticleList>
          {articles.map((article) => (
            <ArticlePreview key={article.title} article={article} />
          ))}
        </ArticleList>
      </Sheet>
      <Sheet backgroundColor="red">
        {positions.map((position) => (
          <div>{position.attributes.title}</div>
        ))}
      </Sheet>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const articles = getArticles();
  const positions = getPositions();
  console.log(articles);
  return {
    props: {
      articles,
      positions,
    },
  };
};

export default Index;
