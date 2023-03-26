import React from "react";
import styled from "styled-components";
import { Title1, Body1 } from "@/typography";
import { Article } from "types";

type Props = {
  article: Article;
};

const Wrapper = styled.a`
  height: 300px;
  flex: 1;
  position: relative;
  margin: 15px;
  cursor: pointer;
  display: flex;
  background: ${({ theme }) => theme.colors.background};

  @media only screen and (max-width: 700px) {
    flex-direction: column;
    height: 500px;
  }
`;

const Title = styled(Title1)`
  line-height: 40px;
  font-family: "Black Ops One", sans-serif;
  font-size: 25px;
  padding: 0 5px;
  margin: 5px 0;
`;

const Summery = styled(Body1)`
  max-width: 300px;
  padding: 0 5px;
  margin: 5px 0;
  overflow: hidden;
  letter-spacing: 0.5px;
  line-height: 2.1rem;

  @media only screen and (max-width: 700px) {
    max-height: 100px;
  }
`;

const MetaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
`;

const AsideWrapper = styled.aside<{
  image?: string;
}>`
  background: ${({ theme }) => theme.colors.primary};
  background-size: cover;
  background-position: center;
  ${({ image }) => (image ? `background-image: url(${image});` : "")}
  flex: 1;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
`;

const JumboArticlePreview: React.FC<Props> = ({ article }) => {
  return (
    <Wrapper href={`/articles/${article.slug}`}>
      <AsideWrapper image={article.coverUrl} />
      <MetaWrapper>
        <Title>{article.title}</Title>
        <Summery>{article.content}</Summery>
      </MetaWrapper>
    </Wrapper>
  );
};

export { JumboArticlePreview };
