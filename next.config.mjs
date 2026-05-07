/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        worker_threads: false,
      };
    }
    return config;
  },
};

export default nextConfig;
