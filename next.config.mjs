/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.jsdelivr.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.externals.push({
      'mind-ar': 'MINDAR',
      'aframe': 'AFRAME',
    })
    return config
  },
};

export default nextConfig;
