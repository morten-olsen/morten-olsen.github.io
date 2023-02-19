import { useData } from '@hooks/use-data';
import { ArticleGrid } from '@ui/article/grid';

const FrontPage = () => {
  const articles = useData(data => data.articles);

  return (
    <>
      <ArticleGrid articles={articles} />
    </>
  )
}

export { FrontPage };
