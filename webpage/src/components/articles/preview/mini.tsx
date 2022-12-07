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

const Wrapper = styled.a`
  position: relative;
  margin: 15px;
  cursor: pointer;
  display: flex;
  width: 220px;
  height: 200px;

  @media only screen and (max-width: 700px) {
    width: 100%;
  }
`;

const Title = styled(Title1)`
  line-height: 20px;
  font-size: 20px;
  padding: 5px 5px;
  font-family: 'Black Ops One', sans-serif;
  margin: 5px 0;
  background: ${({ theme }) => theme.colors.background};
`;

const MetaWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
  max-width: 220px;
  position: absolute;
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

const MiniArticlePreview: React.FC<Props> = ({ article }) => {
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

export { MiniArticlePreview };
