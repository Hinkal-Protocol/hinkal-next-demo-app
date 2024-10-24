/** @type {import('next').NextConfig} */
import CopyPlugin from "copy-webpack-plugin";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
  },
  webpack: (
    config,
  ) => {
    return {
      ...config,
      // Important this plugins update required for correct @hinkal/common work
      plugins: [
        ...config.plugins || [],
        new CopyPlugin({
          patterns: [{
            from: './node_modules/@hinkal/common/assets/*.js',
            to: './static/media/[name].js'
          }],
        }),
      ],
    }
  },
}

export default nextConfig;