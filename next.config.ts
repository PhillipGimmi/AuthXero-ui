import type { NextConfig } from 'next';

async function checkBackendHealth() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_AUTHXERO_URL}/health`);
    if (response.ok) {
      const healthStatus = await response.json();
      console.log('Backend health status:', healthStatus.message);
    } else {
      console.error('Failed to confirm backend health. Status:', response.status);
    }
  } catch (error) {
    console.error('Error checking backend health:', error);
  }
}
checkBackendHealth();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    NEXT_PUBLIC_AUTHXERO_URL: process.env.NEXT_PUBLIC_AUTHXERO_URL ?? 'http://localhost:8080',
    NEXT_PUBLIC_COOKIE_DOMAIN: process.env.NEXT_PUBLIC_COOKIE_DOMAIN ?? 'localhost',
    NEXT_PUBLIC_SECURE_COOKIES: process.env.NEXT_PUBLIC_SECURE_COOKIES ?? 'false',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { 
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `connect-src 'self' ${process.env.NEXT_PUBLIC_AUTHXERO_URL ?? 'http://localhost:8080'}`,
              "img-src 'self' data: blob:",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "media-src 'self' blob:",
              "worker-src 'self' blob:",
              // Required for Three.js and shader materials
              "child-src 'self' blob:",
              // Required for WebGL
              "webgl-src 'self'"
            ].join('; ')
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { 
            key: 'Permissions-Policy', 
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()"
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
          }
        ],
      },
    ];
  },
  // Add webpack configuration for shader files if needed
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader']
    });
    return config;
  },
};

export default nextConfig;
