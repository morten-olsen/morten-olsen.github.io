import { json } from '@sveltejs/kit';
import { resume } from '$lib/server/resume';

export const GET = async () => {
  return json(resume);
};

export const prerender = true;
