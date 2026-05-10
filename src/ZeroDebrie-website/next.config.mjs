import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['cesium', 'resium', 'three', '@cesium/engine', '@zip.js/zip.js'],
  webpack: (config, { webpack }) => {
    try {
      const zipJsPath = path.dirname(require.resolve('@zip.js/zip.js/package.json'));
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /@zip\.js\/zip\.js\/lib\/zip-no-worker\.js/,
          (resource) => {
            resource.request = path.join(zipJsPath, 'index.js');
          }
        )
      );
    } catch (e) {
      console.warn('Could not resolve @zip.js/zip.js/package.json');
    }
    
    return config;
  }
};

export default nextConfig;
