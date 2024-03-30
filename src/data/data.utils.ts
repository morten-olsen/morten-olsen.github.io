import type { ResumeSchema } from '@/types/resume-schema.js';

import type { Article, Data } from './data';

const getJsonResume = async (data: Data) => {
  const profile = data.profile;
  const resume = {
    basics: profile.basics,
  } satisfies ResumeSchema;

  return resume;
};

const getArticleJsonLD = async (data: Data, article: Article) => {
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.data.title,
    image: article.data.heroImage.src,
    datePublished: article.data.pubDate.toISOString(),
    keywords: article.data.tags,
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      name: data.profile.basics.name,
      url: data.profile.basics.url,
    },
  };
  return jsonld;
};

const getJsonLDResume = async (data: Data) => {
  const work = await data.work.find();
  const currentWork = work.find((w) => !w.data.endDate);
  const otherWork = work.filter((w) => w !== currentWork);

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    id: '#me',
    name: data.profile.basics.name,
    email: data.profile.basics.email,
    image: data.profile.basics.image,
    url: data.profile.basics.url,
    jobTitle: currentWork?.data.position,
    contactPoint: data.profile.basics.profiles.map((profile) => ({
      '@type': 'ContactPoint',
      contactType: profile.network.toLowerCase(),
      identifier: profile.username,
      url: profile.url,
    })),
    address: {
      '@type': 'PostalAddress',
      addressLocality: data.profile.basics.location.city,
      addressRegion: data.profile.basics.location.region,
      addressCountry: data.profile.basics.location.countryCode,
    },
    sameAs: data.profile.basics.profiles.map((profile) => profile.url),
    hasOccupation: currentWork && {
      '@type': 'EmployeeRole',
      roleName: currentWork.data.position,
      startDate: currentWork.data.startDate.toISOString(),
    },
    worksFor: currentWork && {
      '@type': 'Organization',
      name: currentWork?.data.name,
      sameAs: currentWork?.data.url,
    },
    alumniOf: otherWork.map((w) => ({
      '@type': 'Organization',
      name: w.data.name,
      sameAs: w.data.url,
      employee: {
        '@type': 'Person',
        hasOccupation: {
          '@type': 'EmployeeRole',
          roleName: w.data.position,
          startDate: w.data.startDate.toISOString(),
          endDate: w.data.endDate?.toISOString(),
        },
        sameAs: '#me',
      },
    })),
  };

  return jsonld;
};

export { getJsonResume, getJsonLDResume, getArticleJsonLD };
