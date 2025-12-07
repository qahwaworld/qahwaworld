import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
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
