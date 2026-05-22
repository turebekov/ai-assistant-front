/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const backend =
      process.env.EXPRESS_BACKEND_URL ||
      process.env.NEXT_PUBLIC_EXPRESS_BACKEND_URL ||
      'http://localhost:4000'
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
