/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const backend =
      process.env.EXPRESS_BACKEND_URL ||
      process.env.NEXT_PUBLIC_EXPRESS_BACKEND_URL ||
      'http://127.0.0.1:4000'
    return [
      {
        source: '/api/:path*',
        destination: `${backend}/api/:path*`,
      },
      {
        source: '/legacy/:path*',
        destination: `${backend}/:path*`,
      },
      {
        source: '/auth.html',
        destination: '/auth',
      },
      {
        source: '/subscription.html',
        destination: '/subscription',
      },
    ]
  },
}

export default nextConfig
