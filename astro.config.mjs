import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://mortenolsen.pro',
	integrations: [mdx(), sitemap()],
	vite: {
		build: {
			assetsInlineLimit: 1024 * 10,
		}
	},
});
