import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import compress from 'astro-compress'
import robotsTxt from 'astro-robots-txt'
const getSiteInfo = () => {
  const siteUrl = process.env.SITE_URL
  if (!siteUrl) {
    return {}
  }
  const url = new URL(siteUrl)
  return {
    site: `${url.protocol}//${url.host}`,
    base: url.pathname
  }
}

// https://astro.build/config
export default defineConfig({
  ...getSiteInfo(),
  output: 'static',
  integrations: [mdx(), sitemap(), icon(), compress(), robotsTxt()],
  vite: {
    build: {
      assetsInlineLimit: 1024 * 10
    }
  }
})
