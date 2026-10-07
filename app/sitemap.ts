import type { MetadataRoute } from "next";
import { getProjectSlugs } from "@/lib/mdx";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const pagePaths = ["/", "/blog/", "/projects/", "/publications/", "/contact/", "/cv/"];
  const projectPaths = getProjectSlugs().map((slug) => `/projects/${slug}/`);

  return [...pagePaths, ...projectPaths].map((path) => ({
    url: `${baseUrl}${path}`
  }));
}
