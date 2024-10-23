/** @type {import('next').NextConfig} */
import withWorkers from '@zeit/next-workers';

const nextConfig = withWorkers({
  workerLoaderOptions: { inline: true },
})

export default nextConfig;