import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio 100% dinámico (catálogo y pedidos en vivo desde Turso).
  cacheComponents: false,
  // Subida de galería de imágenes vía Server Action (BLOB en Turso)
  experimental: {
    serverActions: { bodySizeLimit: "30mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
