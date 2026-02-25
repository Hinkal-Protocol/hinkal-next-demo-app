/** @type {import('next').NextConfig} */
import CopyPlugin from "copy-webpack-plugin";

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["web-worker"], //  serverComponentsExternalPackages tells Next.js: "don't bundle this package at all for the server — just call it natively at runtime."
  },
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
  webpack: (config) => {
    return {
      ...config,
      // Important this plugins update required for correct @hinkal/common work
      plugins: [
        ...(config.plugins || []),
        new CopyPlugin({
          patterns: [
            {
              from: "./node_modules/@hinkal/common/assets/*.js",
              to: "./static/media/[name].js",
              noErrorOnMissing: true,
            },
          ],
        }),
      ],
    };
  },
};

export default nextConfig;
