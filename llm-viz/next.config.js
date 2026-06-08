/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  output: process.env.LLM_VIZ_EXPORT === "1" ? "export" : undefined,
  basePath: process.env.LLM_VIZ_EXPORT === "1" ? "/llm-viz" : "",
  assetPrefix: process.env.LLM_VIZ_EXPORT === "1" ? "/llm-viz" : "",
  trailingSlash: true,
  images: { unoptimized: true },
};

module.exports = nextConfig;
