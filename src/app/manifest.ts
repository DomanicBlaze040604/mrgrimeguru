import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mr GrimeGuru — Modern Indian Cleaning Essentials',
    short_name: 'Mr GrimeGuru',
    description: 'Kitchen, multipurpose and shoe foam cleaners for everyday home care.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fffbf0',
    theme_color: '#f97316',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
