import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import hydrate from "next-mdx-remote/hydrate";
import services from '../../../services';
import getComponents from '../../../articleComponents';

const IndexPage = ({ article }: any) => (
  <article>
    <h1>{article.data.title}</h1>
    {hydrate(article.mdx, { components: getComponents(article.name) })}
    Page!
  </article>
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string|| 'unknown';
  await services.prepare();
  const article = services.articles.get(slug);
  return {
    props: {
      article,
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  await services.prepare();
  return {
    paths: services.articles.list.map(a => `/blog/post/${a.name}`),
    fallback: false,
  };
};

export default IndexPage;
