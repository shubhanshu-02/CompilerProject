import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude Node.js modules from client-side bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        child_process: false,
        'node:fs': false,
        'node:path': false,
        'node:crypto': false,
        'node:child_process': false,
        'node:fs/promises': false,
        'node:url': false,
        'node:buffer': false,
        'node:stream': false,
        'node:util': false,
        'node:events': false,
        'node:os': false,
        'node:process': false,
      };

      // Handle Pyodide-specific configurations
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          'node:child_process': 'commonjs node:child_process',
          'node:fs': 'commonjs node:fs',
          'node:path': 'commonjs node:path',
        });
      }

      // Ignore Node.js built-in modules
      config.plugins = config.plugins || [];
      config.plugins.push(
        new (require('webpack')).IgnorePlugin({
          resourceRegExp: /^(node:)?child_process$/,
        })
      );
    }
    return config;
  },
  eslint: {
    // Disable ESLint during builds to avoid blocking on warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable type checking during builds for now
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
