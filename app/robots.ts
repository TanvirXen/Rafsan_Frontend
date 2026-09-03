import type { MetadataRoute } from "next";
import { getSiteUrl } from "./lib/siteSeo";

export default function robots(): MetadataRoute.Robots {
  const sitemap = getSiteUrl("/sitemap.xml");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap,
    host: getSiteUrl("/"),
  };
}
