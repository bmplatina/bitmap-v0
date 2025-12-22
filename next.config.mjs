/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // Uncomment below if using code-server development environment
  // basePath: "/absproxy/3000",

  output: "standalone", // 이 한 줄이 서버 리소스를 획기적으로 줄여줍니다.
};

export default nextConfig;
