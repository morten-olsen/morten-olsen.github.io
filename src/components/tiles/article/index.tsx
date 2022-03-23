import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { Article } from '../../../data/articles';
import { SlideIn } from '../../animations/slide-in';

type Props = {
  article: Article;
}

const Wrapper = styled(SlideIn)`
  cursor: pointer;
  display: flex;
  padding: 15px;
`;

const Inner = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ImageWrapper = styled.div`
  width: 160px;
  max-height: 100%;
  position: relative;
  margin-left: 20px;
`;

const Header = styled.h3`
  margin: 0;
  font-weight: 600;
`;

const Published = styled.time`
  display: block;
  font-size: 0.8rem;
  padding-bottom: 1rem;
`;

const Image = styled.div<{
  src: string
}>`
  position: absolute; 
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('${({src}) => src}');
  background-size: cover;
  background-position: center;
`;

const ArticleTile: React.FC<Props> = ({ article }) => (
  <Link href={`/articles/${article.id}`}>
    <Wrapper>
      <Inner>
        <Header>
          {article.title}
        </Header>
        <Published>{article.published}</Published>
      </Inner>
      {article.cover && (
        <ImageWrapper>
          <Image src={article.cover} />
        </ImageWrapper>
      )}
    </Wrapper>
  </Link>
);

export { ArticleTile };
