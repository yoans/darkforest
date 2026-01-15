/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // No basePath needed - using custom domain darkforest.sagaciasoft.com
}

module.exports = nextConfig