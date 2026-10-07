import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/images/"],
        disallow: ["/admin", "/admin/", "/api/", "/checkout", "/carrito", "/pedido/"],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
