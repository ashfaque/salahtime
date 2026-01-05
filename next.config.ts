import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = "";
let basePath = "";

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY?.replace(/.*?\//, "");
  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

const nextConfig: NextConfig = {
  /* config options here */
  // output: "export",  // Enable static export for GitHub Pages like Angular builds.
  output: isGithubActions ? "export" : undefined,
  // Allow builds to succeed even if ESLint or TypeScript checks fail.
  // NOTE: This disables enforcement during CI/builds — prefer fixing root causes.
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  // typescript: {
  //   // ⚠️ Allows production builds even with type errors. Use sparingly.
  //   ignoreBuildErrors: true,
  // },
  images: {
    unoptimized: true,
  },
  assetPrefix: assetPrefix,
  basePath: basePath,
  trailingSlash: true,
};

export default nextConfig;
