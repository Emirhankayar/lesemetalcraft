/** @type {import('next').NextConfig} */
const nextConfig = {
  /*output: 'export', */
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: '',
        pathname: '/**',
      },
          {
        protocol: 'https',
        hostname: 'btnysdcbecuplblgnymd.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
