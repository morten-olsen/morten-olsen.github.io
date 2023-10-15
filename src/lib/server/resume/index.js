import grayMatter from 'gray-matter';
import * as basics from './basics';

const workData = import.meta.glob('./work/*.md', {
  eager: true,
  as: 'raw'
});

const referencesData = import.meta.glob('./references/*.md', {
  eager: true,
  as: 'raw'
});

const work = Object.values(workData)
  .map((item) => {
    const { data: frontmatter, content } = grayMatter(item);
    return {
      ...frontmatter,
      summary: content.trim()
    };
  })
  .sort((a, b) => {
    const aStart = new Date(a.startDate);
    const bStart = new Date(b.startDate);
    return bStart - aStart;
  });

const references = Object.values(referencesData).map((item) => {
  const { data: frontmatter, content } = grayMatter(item);
  return {
    ...frontmatter,
    reference: content.trim()
  };
});

const resume = {
  ...JSON.parse(JSON.stringify(basics)),
  work,
  references
};

export { resume };
