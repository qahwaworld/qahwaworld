import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend.qahwaworld.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_DB_URI?.replace('http://', '').replace('https://', '') || 'qahwaworldbackend.local',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_DB_URI?.replace('http://', '').replace('https://', '') || 'qahwaworldbackend.local',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Aggressive image optimization for mobile LCP
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    unoptimized: false,
    // Configure image qualities to support various optimization levels
    qualities: [75, 90],
  },

  reactStrictMode: true,
  // Optimize production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Optimize CSS and fonts
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },

  // Add headers for better performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  // Turbopack config (Next.js 16 uses Turbopack by default)
  turbopack: {},
  // Webpack config (used when --webpack flag is explicitly passed)
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Suppress Buffer deprecation warnings from dependencies
      config.ignoreWarnings = [
        { module: /node_modules\/@mailchimp\/mailchimp_marketing/ },
        /Buffer\(\) is deprecated/,
      ];
    }
    return config;
  },
};

export default nextConfig;