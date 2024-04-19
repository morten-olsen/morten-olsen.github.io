import { icons } from '@/assets/images/icons.js'
import { data } from '@/data/data.js'
import type { ManifestOptions } from 'vite-plugin-pwa'

export async function GET() {
  const [maskableIcon] = icons.pngs.filter(
    (icon) => icon.size === '512x512' && icon.src.includes('png')
  )
  const nonMaskableIcons = icons.pngs.filter((icon) => icon !== maskableIcon)
  const basics = data.profile.basics

  const manifest: Partial<ManifestOptions> = {
    name: basics.name,
    short_name: basics.name,
    description: basics.tagline,
    theme_color: '#30E130',
    background_color: data.site.theme,
    start_url: '/',
    display: 'minimal-ui',
    icons: [
      ...nonMaskableIcons.map((png) => ({
        src: png.src,
        sizes: png.size,
        type: 'image/png'
      })),
      ...(maskableIcon
        ? [
            {
              src: maskableIcon.src,
              sizes: maskableIcon.size,
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        : [])
    ]
  }
  return new Response(JSON.stringify(manifest, null, 2))
}
