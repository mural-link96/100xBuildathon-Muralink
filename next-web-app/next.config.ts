import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_BASETEN_API_URL: process.env.NEXT_PUBLIC_BASETEN_API_URL,
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '**',
      },
    ],
  },
  // Add redirects for the renamed studio path
  async redirects() {
    return [
      {
        source: '/studio-21220397-muralink-19022025',
        destination: '/studio',
        permanent: true,
      },
      {
        source: '/studio-21220397-muralink-19022025/:path*',
        destination: '/studio/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
