import createMDX from "@next/mdx";
import path from "node:path";

const withMDX = createMDX({
  extension: /\.mdx?$/
});

function getGitHubPagesConfig() {
  const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];

  if (!repository || repository.endsWith(".github.io")) {
    return {
      assetPrefix: undefined,
      basePath: ""
    };
  }

  const basePath = `/${repository}`;

  return {
    assetPrefix: basePath,
    basePath
  };
}

const githubPages = getGitHubPagesConfig();

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: githubPages.assetPrefix,
  basePath: githubPages.basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: githubPages.basePath
  },
  output: "export",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  outputFileTracingRoot: path.join(process.cwd()),
  trailingSlash: true,
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"]
  }
};

export default withMDX(nextConfig);
