import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  productionBrowserSourceMaps: false,
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
};

export default nextConfig;
