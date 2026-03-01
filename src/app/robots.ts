import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://design-pattern-visualizer.vercel.app/sitemap.xml",
  };
}
