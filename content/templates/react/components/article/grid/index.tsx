import React, { useMemo } from "react";
import styled from "styled-components";
import ArticlePreview from "../preview";
import { JumboArticlePreview } from "../preview/jumbo";
import { MiniArticlePreview } from "../preview/mini";
import { Article } from "types";

type Props = {
  articles: Article[];
};

const Wrapper = styled.div`
  width: 100%;
`;

const FeaturedArticle = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const FeaturedArticles = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  width: 100%;
  flex-wrap: wrap;
`;

const RemainingArticles = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 auto;
  width: 100%;
`;

const ArticleGrid: React.FC<Props> = ({ articles }) => {
  const sorted = useMemo(
    () => articles,
    // TODO:
    // articles.sort(
    //   (a, b) =>
    //     new Date(b.published).getTime() -
    //     new Date(a.published).getTime()
    // ),
    [articles]
  );
  const featured1 = useMemo(() => sorted.slice(0, 1)[0], [sorted]);

  const featured2 = useMemo(() => sorted.slice(1, 4), [sorted]);

  const remaining = useMemo(() => sorted.slice(4, 12), [sorted]);

  return (
    <Wrapper>
      <FeaturedArticle>
        <JumboArticlePreview article={featured1} />
      </FeaturedArticle>
      <FeaturedArticles>
        {featured2.map((article) => (
          <ArticlePreview key={article.title} article={article} />
        ))}
      </FeaturedArticles>
      <RemainingArticles>
        {remaining.map((article) => (
          <MiniArticlePreview key={article.title} article={article} />
        ))}
      </RemainingArticles>
    </Wrapper>
  );
};

export { ArticleGrid };
