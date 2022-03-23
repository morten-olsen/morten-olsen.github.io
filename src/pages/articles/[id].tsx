import React from 'react';
import styled from 'styled-components';
import { Article, articleDB } from '../../data/articles';
import { Content } from '../../components/content';
import ReactMarkdown, { Components } from 'react-markdown';
import { Navigation } from '../../components/navigation';
import Head from 'next/head';
import { Profile, profileDB } from '../../data/profile';

type Props = {
  article: Article;
  profile: Profile;
};

const Image = styled.img`
`;

const ImageWrapper = styled.span`
  display: block;
  text-align: center;
`;

const Wrapper = styled.article`
  line-height: 1.8rem;
  background: #fff;

  p + p:first-letter {
    margin-left: 1.8rem;
  }

  p:first-of-type::first-letter {
    font-size: 6rem;
    float: left;
    padding: 1rem;
    margin: 0 1rem;
  }

  p {
    letter-spacing: 0.5px;
  }

  img {
    max-width: 100%;
    margin: auto;
  }

  h1 {
    font-size: 3rem;
    line-height: 3.8rem;
    margin-bottom: 0;
  }
`;

const Published = styled.time`
  font-size: 0.8rem;
`;

const Cover = styled.img`
  width: 100%;
  max-width: 100%;
  float: both;
`;

const components: Components = {
  img: (props) => (
    <ImageWrapper>
      <Image {...props} />
    </ImageWrapper>
  )
};

const ArticleView: React.FC<Props> = ({
  article,
  profile,
}) => {
  return (
    <>
      <Head>
        <title>{profile.name} - {article.title}</title>
      </Head>
      <Navigation name={profile.name} />
      <Content>
        <Wrapper>
          <h1>{article.title}</h1>
          <Published>3 days ago</Published>
          <Cover src={article.cover} />
          <ReactMarkdown components={components}>
            {article.content}
          </ReactMarkdown>
        </Wrapper>
      </Content>
    </>
  )
};

export async function getStaticPaths() {
  const articles = await articleDB.list();
  return {
    paths: articles.map(a => `/articles/${a.id}`),
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const { id } = params;
  const article = await articleDB.get(id); 
  const profile = await profileDB.get();
  return {
    props: {
      article,
      profile,
    }
  }
}

export default ArticleView;
