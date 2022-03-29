import Head from 'next/head';
import React from 'react';
import Container from 'typedi';
import { Content } from '../components/content';
import { Experiences } from '../components/experiences';
import { Featured } from '../components/featured';
import { Hero } from '../components/hero';
import { ArticleTile } from '../components/tiles/article';
import { AssetResolver } from '../data/assets';
import { WebpackAssetResolver } from '../data/assets/WebpackAssets';
import { Article, ArticleDB } from '../data/repos/articles';
import { Experience, ExperienceDB } from '../data/repos/experiences';
import { Profile, ProfileDB } from '../data/repos/profile';

type Props = {
  resume: string;
  articles: Article[];
  profile: Profile;
  experiences: Experience[];
};


const Home: React.FC<Props> = ({ resume, articles, profile, experiences }) => {
  console.log('resume', resume);
  return (
    <>
      <Head>
        <title>{profile.name} - {profile.tagline}</title>
      </Head>
      <Hero profile={profile} />
      <Content>
        <Featured title="Latest articles">
          {articles.map((article) => (
            <ArticleTile key={article.id} article={article} />
          ))}
        </Featured>
        <Experiences experiences={experiences} />
      </Content>
    </>
  );
};

export async function getStaticProps() {
  Container.set(AssetResolver, new WebpackAssetResolver());
  const articleDB = Container.get(ArticleDB);
  const profileDB = Container.get(ProfileDB);
  const experienceDB = Container.get(ExperienceDB);
  const assets = Container.get(AssetResolver);
  const articles = await articleDB.list(); 
  const profile = await profileDB.get();
  const experiences = await experienceDB.list();
  const resume = assets.getPath('profile', 'a4.tex.yml');
  return {
    props: {
      resume,
      profile,
      articles,
      experiences,
    }
  }
}

export default Home;
