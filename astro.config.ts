import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import robotsTxt from 'astro-robots-txt'
import compress from '@playform/compress'

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
  server: {
    allowedHosts: true,
  },
  integrations: [mdx(), sitemap(), icon(), compress({
    HTML: false,
    Image: false,
  }), robotsTxt()],
  devToolbar: {
    enabled: false,
  },
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      assetsInlineLimit: 1024 * 10

    }
  }
})
