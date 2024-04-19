import { getImage } from 'astro:assets'
import { data } from '@/data/data.js'

const imageSizes = [16, 32, 48, 64, 96, 128, 256, 512]

const pngs = await Promise.all(
  imageSizes.map(async (size) => {
    return {
      ...(await getImage({
        src: data.profile.image,
        format: 'png',
        width: size,
        height: size
      })),
      size: `${size}x${size}`
    }
  })
)

const icons = {
  pngs
}
export { icons }
