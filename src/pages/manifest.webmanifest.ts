import type { ManifestOptions } from 'vite-plugin-pwa'

import { icons } from '~/assets/images/images.icons';
import { data } from '~/data/data';

export async function GET() {
  const [maskableIcon] = icons.pngs.filter(
    (icon) => icon.size === '512x512' && icon.src.includes('png')
  )
  const nonMaskableIcons = icons.pngs.filter((icon) => icon !== maskableIcon)
  const { profile } = data;

  const manifest: Partial<ManifestOptions> = {
    name: profile.name,
    short_name: profile.name,
    // description: basics.tagline,
    theme_color: '#30E130',
    // background_color: data.site.theme,
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
