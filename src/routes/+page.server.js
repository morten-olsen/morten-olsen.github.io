import { posts } from '$lib/server/posts';
import { resume } from '$lib/server/resume';

export const load = async () => {
	return {
		posts,
		resume
	};
};
