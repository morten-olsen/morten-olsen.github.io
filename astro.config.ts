import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import robotsTxt from 'astro-robots-txt'
import compress from '@playform/compress'

const getSiteInfo = () => {
  // Canonical URL is mortenolsen.pro; env override exists so the GitHub
  // Pages mirror can point at morten-olsen.github.io without code changes.
  const siteUrl = process.env.SITE_URL ?? 'https://mortenolsen.pro'
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
  integrations: [sitemap(), icon(), compress({
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
