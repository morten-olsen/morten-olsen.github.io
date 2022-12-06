import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Title1 } from 'typography';
import { getArticles } from '@morten-olsen/personal-webpage-articles/dist/index';

type Props = {
  article: ReturnType<typeof getArticles>[number];
};

const Wrapper = styled.div`
  height: 300px;
  width: 300px;
  position: relative;
  margin: 10px;
`;

const Title = styled(Title1)`
  background: ${({ theme }) => theme.colors.primary};
  padding: 5px 0;
  line-height: 40px;
`;

const MetaWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 10px;
`;

const AsideWrapper = styled.aside<{
  image?: string;
}>`
  background: ${({ theme }) => theme.colors.primary};
  background-size: cover;
  background-position: center;
  ${({ image }) => (image ? `background-image: url(${image});` : '')}
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
`;

const ArticlePreview: React.FC<Props> = ({ article }) => {
  return (
    <Link href={`/articles/${article.meta.slug}`}>
      <Wrapper>
        <AsideWrapper image={article.cover!} />
        <MetaWrapper>
          <Title>{article.title}</Title>
        </MetaWrapper>
      </Wrapper>
    </Link>
  );
};

export default ArticlePreview;
