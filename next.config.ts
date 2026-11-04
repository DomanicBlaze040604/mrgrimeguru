import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: { position: 'bottom-right' },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: '/guides', destination: '/blog', permanent: true },
      { source: '/search', destination: '/shop', permanent: true },
      { source: '/products/clean-home-starter', destination: '/shop#clean-home-starter', permanent: true },
      { source: '/products/grime-fighting-trio', destination: '/shop#grime-fighting-trio', permanent: true },
      { source: '/shop/kitchen-degreaser', destination: '/shop/kitchen-cleaner', permanent: true },
      { source: '/shop/floor-cleaner', destination: '/shop/multipurpose-cleaner', permanent: true },
      { source: '/shop/laundry-beads', destination: '/shop', permanent: true },
      { source: '/shop/laundry-pods', destination: '/shop#coming-soon', permanent: true },
      ...['kitchen-cleaner', 'multipurpose-cleaner', 'shoe-cleaner'].map(slug => ({ source: `/products/${slug}`, destination: `/shop/${slug}`, permanent: true })),
      { source: '/products/kitchen-degreaser', destination: '/shop/kitchen-cleaner', permanent: true },
      { source: '/products/floor-cleaner', destination: '/shop/multipurpose-cleaner', permanent: true },
      { source: '/products/laundry-pods', destination: '/shop#coming-soon', permanent: true },
      { source: '/products/laundry-beads', destination: '/shop', permanent: true },
      { source: '/blog/kitchen-degreasing-guide-chimneys-tiles-stovetops', destination: '/blog/deep-clean-chimney-filters', permanent: true },
      { source: '/blog/pet-safe-floor-cleaners-botanical-guide', destination: '/blog/pet-friendly-surface-cleaning-guide', permanent: true },
      { source: '/blog/restore-white-sneakers-in-3-minutes-waterless', destination: '/blog/sneaker-care-playbook-white-kicks', permanent: true },
    ]
  },
  async headers() {
    return [
      ...['/admin/:path*', '/api/:path*', '/account/:path*', '/checkout/:path*', '/cart', '/login', '/order-success'].map(source => ({ source, headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] })),
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
