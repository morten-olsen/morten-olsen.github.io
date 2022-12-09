import React, { FC } from 'react';
import styled from 'styled-components';
import { Jumbo } from 'typography';
import { getArticles } from '@morten-olsen/personal-webpage-articles/dist/index';
import { GetStaticProps } from 'next';
import { getPositions, Position } from '@morten-olsen/personal-webpage-profile';
import { Sheet } from '../components/sheet';
import { ArticleGrid } from 'components/articles/grid';
const cover = require('./cover.jpg');

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

const Index: FC<Props> = ({ articles }) => {
  return (
    <>
      <Sheet color="#c85279" background={cover}>
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
      </Sheet>
      <Sheet color="#ef23e2">
        <Hero>
          {'Table of Content'.split(' ').map((char, index) => (
            <Title key={index}>{char}</Title>
          ))}
        </Hero>
        <ArticleGrid articles={articles} />
      </Sheet>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const articles = getArticles();
  const positions = getPositions();
  return {
    props: {
      articles,
      positions,
    },
  };
};

export default Index;
