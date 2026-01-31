/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 프로덕션 빌드 최적화

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // 이미지 최적화 설정
  images: {
    // Supabase Storage 도메인 허용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // 이미지 포맷 최적화
    formats: ['image/avif', 'image/webp'],
    // 이미지 크기 제한
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 환경 변수는 Vercel에서 자동으로 처리되므로 next.config.js에서 설정 불필요
  // 필요시 런타임에서 process.env로 접근 가능
};

module.exports = nextConfig;
