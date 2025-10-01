/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    ORCHESTRATOR_URL: process.env.ORCHESTRATOR_URL || 'http://localhost:3001',
  },
}

module.exports = nextConfig