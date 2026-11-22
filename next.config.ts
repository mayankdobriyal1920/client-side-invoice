import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.paddle.com https://pagead2.googlesyndication.com https://www.googletagmanager.com https://static.cloudflareinsights.com https://public.profitwell.com; style-src 'self' 'unsafe-inline' https://cdn.paddle.com; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://api.paddle.com https://sandbox-api.paddle.com https://checkout-service.paddle.com https://www.google-analytics.com https://cdn.paddle.com https://buy.paddle.com; frame-src https://checkout.paddle.com https://buy.paddle.com;" },
        ],
      },
    ];
  },
};

export default nextConfig;