import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: 'https://mortenolsen.pro',
  integrations: [mdx(), sitemap(), tailwind({
    nesting: true
  }), icon()],
  vite: {
    build: {
      assetsInlineLimit: 1024 * 10
    }
  }
});