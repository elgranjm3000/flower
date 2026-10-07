import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const products = await listProducts({ limit: 1000 });

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/productos`, changeFrequency: "daily", priority: 0.9 },
    ...["damas", "caballeros", "calzado", "accesorios"].map((d) => ({
      url: `${base}/productos?department=${d}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${base}/producto/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
