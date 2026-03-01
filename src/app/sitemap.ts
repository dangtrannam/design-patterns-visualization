import type { MetadataRoute } from "next";
import { patternSlugs } from "@/content";

const BASE = "https://design-pattern-visualizer.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...patternSlugs.map((slug) => ({
      url: `${BASE}/patterns/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
