import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mr GrimeGuru — Modern Indian Cleaning Essentials',
    short_name: 'Mr GrimeGuru',
    description: 'High-performance household cleaning products for modern Indian homes. Laundry pods, scented beads, floor cleaner, degreaser, and shoe care.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF8F2',
    theme_color: '#347F99',
    icons: [
      {
        src: '/images/brand/logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/images/brand/logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  }
}
