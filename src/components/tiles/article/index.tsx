import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { Article } from '../../../data/repos/articles';
import { SlideIn } from '../../animations/slide-in';
import { formatDistanceToNow } from 'date-fns';

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

const Meta = styled.time`
  display: block;
  font-size: 0.8rem;
  padding-bottom: 1rem;
`;

const Published = styled.time`
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
        <Meta>
          <Published>{formatDistanceToNow(new Date(article.published || 0), { addSuffix: true })}</Published>
        </Meta>
        <Header>
          {article.title}
        </Header>
        <Meta>
          <br />{article.stats.minutes.toFixed(0)} min read
        </Meta>
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
