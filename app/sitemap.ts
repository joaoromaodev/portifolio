import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// One-page site: the sections are anchors on `/`, and search engines don't
// index fragments separately, so the sitemap has a single entry.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
