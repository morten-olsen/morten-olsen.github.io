import React, { useMemo } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Title1 } from 'typography';
import { getArticles } from '@morten-olsen/personal-webpage-articles/dist/index';
import { createTheme } from 'theme/create';
import { ThemeProvider } from 'theme/provider';

type Props = {
  article: ReturnType<typeof getArticles>[number];
};

const Wrapper = styled.div`
  height: 500px;
  border-right: 2px solid rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 200px;
  position: relative;
  margin: 15px;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 700px) {
    max-height: 300px;
  }
`;

const Title = styled(Title1)`
  background: ${({ theme }) => theme.colors.primary};
  line-height: 40px;
  font-family: 'Black Ops One', sans-serif;
  font-size: 25px;
  padding: 0 5px;
  margin: 5px 0;
`;

const MetaWrapper = styled.div`
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  flex-wrap: wrap;
`;

const AsideWrapper = styled.aside<{
  image?: string;
}>`
  background: ${({ theme }) => theme.colors.primary};
  background-size: cover;
  background-position: center;
  ${({ image }) => (image ? `background-image: url(${image});` : '')}
  flex: 1;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
`;

const ArticlePreview: React.FC<Props> = ({ article }) => {
  const theme = useMemo(
    () =>
      createTheme({
        baseColor: article.meta.color,
      }),
    [article.meta.color]
  );
  return (
    <ThemeProvider theme={theme}>
      <Link href={`/articles/${article.meta.slug}`}>
        <Wrapper>
          <AsideWrapper image={article.cover!} />
          <MetaWrapper>
            {article.title.split(' ').map((word, index) => (
              <Title key={index}>{word}</Title>
            ))}
          </MetaWrapper>
        </Wrapper>
      </Link>
    </ThemeProvider>
  );
};

export default ArticlePreview;