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
    // 이미지 포맷 최적화
    formats: ['image/avif', 'image/webp'],
    // 이미지 크기 제한
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

};

module.exports = nextConfig;

const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
initOpenNextCloudflareForDev();
