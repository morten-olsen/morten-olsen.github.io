import React from 'react';
import Link from "next/link";
import { GetStaticProps } from 'next';
import services from '../services';


const IndexPage = ({ articles }: any) => {
  return(
    <div>
      {articles.map((article: any) => (
        <Link href={`/blog/post/${article.name}`}>
          <div>
            <h2>{article.data.title}</h2>
            <p>{article.data.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  await services.prepare();
  const articles = services.articles.list;
  return {
    props: {
      articles,
    }
  };
};

export default IndexPage;
