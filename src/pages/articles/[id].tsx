import React from 'react';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import { Content } from '../../components/content';
import ReactMarkdown, { Components } from 'react-markdown';
import { Navigation } from '../../components/navigation';
import Head from 'next/head';
import { Article, ArticleDB } from '../../data/repos/articles';
import { Profile, ProfileDB } from '../../data/repos/profile';
import Container from 'typedi';
import { AssetResolver } from '../../data/assets';
import { WebpackAssetResolver } from '../../data/assets/WebpackAssets';

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
  line-height: 2.1rem;
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

  h2 {
    margin-top: 5rem;
  }

  h3 {
    margin-top: 3rem;
  }
`;

const Meta = styled.div`
  font-size: 0.8rem;
`;

const Published = styled.time`
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
        <meta property="og:title" content={article.title} />
        {article.summery && <meta property="og:title" content={article.title} />}
        {article.shareImage && <meta property="og:image" content={article.shareImage} />}
      </Head>
      <Navigation name={profile.name} />
      <Content>
        <Wrapper>
          <h1>{article.title}</h1>
          <Meta>
            <Published>{formatDistanceToNow(new Date(article.published || 0), { addSuffix: true })}</Published>
            {' '} - {article.stats.minutes.toFixed(0)} minute read
            {' '} - {article.pdfs.a4 &&(
              <a href={article.pdfs.a4} target="_blank">Download as PDF</a>
            )}
          </Meta>
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
  Container.set(AssetResolver, new WebpackAssetResolver());
  const articleDB = Container.get(ArticleDB);
  const articles = await articleDB.list();
  return {
    paths: articles.map(a => `/articles/${a.id}`),
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const { id } = params;
  Container.set(AssetResolver, new WebpackAssetResolver());
  const articleDB = Container.get(ArticleDB);
  const profileDB = Container.get(ProfileDB);
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
