import styled from 'styled-components';
import { useData } from "../hooks/use-data";
import { Jumbo } from 'ui/typography';
import { createTheme, ThemeProvider } from 'ui/theme';

const Wrapper = styled.div`
  background: red;
`;

const Demo = () => {
  const articles = useData(data => data.articles);
  return (
    <ThemeProvider theme={createTheme()}>
    <Wrapper>
      {articles.map((article) => (
        <Wrapper key={article.slug}>
          <Jumbo>{article.title}</Jumbo>
        </Wrapper>
      ))}
    </Wrapper>
    </ThemeProvider>
  );
};

export { Demo };
