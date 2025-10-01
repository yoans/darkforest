/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/dark-forest-network' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/dark-forest-network/' : '',
}

module.exports = nextConfig