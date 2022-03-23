import Head from 'next/head';
import React from 'react';
import { Content } from '../components/content';
import { Experiences } from '../components/experiences';
import { Featured } from '../components/featured';
import { Hero } from '../components/hero';
import { ArticleTile } from '../components/tiles/article';
import { Article, articleDB } from '../data/articles';
import { Experience, experienceDB } from '../data/experiences';
import { Profile, profileDB } from '../data/profile';

type Props = {
  articles: Article[];
  profile: Profile;
  experiences: Experience[];
};


const Home: React.FC<Props> = ({ articles, profile, experiences }) => (
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

export async function getStaticProps() {
  const articles = await articleDB.list(); 
  const profile = await profileDB.get();
  const experiences = await experienceDB.list();
  return {
    props: {
      profile,
      articles,
      experiences,
    }
  }
}

export default Home;
