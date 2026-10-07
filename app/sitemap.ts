import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const pagePaths = ["/", "/blog/", "/projects/", "/publications/"];

  return pagePaths.map((path) => ({
    url: `${baseUrl}${path}`
  }));
}
