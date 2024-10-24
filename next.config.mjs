/** @type {import('next').NextConfig} */
import CopyPlugin from "copy-webpack-plugin";

const nextConfig = {
  webpack: (
    config,
  ) => {
    // Important: return the modified config
    return {
      ...config,
      plugins: [
        ...config.plugins || [],
        new CopyPlugin({
          patterns: [{
            from: './node_modules/@hinkal/common/assets',
            to: './static/media'
          }],
        }),
      ],
    }
  },
}

export default nextConfig;