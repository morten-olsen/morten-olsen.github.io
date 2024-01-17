import { getCollection } from 'astro:content';
import { basics, skills, languages } from '../data/profile';


export async function GET() {
  const work = await getCollection('work');
  const references = await getCollection('references');
  const resume = {
    ...basics,
    skills,
    languages,
    work: work.map((item) => ({
      ...item.data,
    })),
    references: references.map((item) => ({
      ...item.data,
    })),
  }
  return new Response(JSON.stringify(resume));
};
