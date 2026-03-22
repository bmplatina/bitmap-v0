import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

const withNextIntl = createNextIntlPlugin();

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // Uncomment below if using code-server development environment
  // basePath: "/absproxy/3000",

  output: "standalone", // 이 한 줄이 서버 리소스를 획기적으로 줄여줍니다.

  experimental: {
    allowedDevOrigins: ["playgrounds.prodbybitmap.com"],
  },

  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: "https://api.prodbybitmap.com/:path*",
      },
    ];
  },
  webpack: (config) => {
    config.infrastructureLogging = {
      level: "error",
    };
    return config;
  },
};

export default withPWA(withNextIntl(nextConfig));
