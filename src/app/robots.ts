import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/resend";

export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/account", "/signin", "/unsubscribe"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
