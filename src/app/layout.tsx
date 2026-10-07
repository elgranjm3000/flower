import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Sunflower by Company | Ropa de Dama y Caballero en Venezuela",
    template: "%s | Sunflower by Company",
  },
  description:
    "Venta de ropa para dama y caballero: camisas, vestidos, jeans, calzado y accesorios. Precios en USD y Bs. a tasa oficial BCV · Pago Móvil y Zelle verificados · Envíos MRW, Tealca y Zoom a toda Venezuela.",
  keywords: [
    "ropa de dama",
    "ropa de caballero",
    "venta de ropa Venezuela",
    "tienda de ropa online Venezuela",
    "moda dama y caballero",
    "precios en dólares y bolívares",
    "pago móvil",
    "zelle",
    "MRW",
    "Tealca",
  ],
  openGraph: {
    type: "website",
    locale: "es_VE",
    siteName: "Sunflower by Company",
    title: "Sunflower by Company | Ropa de Dama y Caballero",
    description:
      "Venta de ropa para dama y caballero con estilo. Precios en USD y Bs. a tasa BCV · Pago Móvil y Zelle verificados · Envíos a toda Venezuela.",
    images: [
      { url: "/brand-logo.jpg", width: 1165, height: 665, alt: "Sunflower by Company — Men & Women's Apparel" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunflower by Company | Ropa de Dama y Caballero",
    description:
      "Venta de ropa dama y caballero · USD y Bs. a tasa BCV · Pago Móvil y Zelle verificados.",
    images: ["/brand-logo.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
