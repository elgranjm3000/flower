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
    default: "Sunflower by Company — Moda y calzado en Venezuela",
    template: "%s | Sunflower by Company",
  },
  description:
    "Tienda de moda, calzado y accesorios con precios en dólares y bolívares a la tasa oficial BCV. Paga con Pago Móvil o Zelle. Envíos MRW, Tealca y Zoom a toda Venezuela.",
  keywords: [
    "tienda de ropa Venezuela",
    "moda online Venezuela",
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
    title: "Sunflower by Company — Moda y calzado en Venezuela",
    description:
      "Precios en USD y Bs. a tasa BCV. Pago Móvil y Zelle verificados. Envíos a toda Venezuela.",
    images: [{ url: "/api/images/og-default", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunflower by Company — Moda y calzado en Venezuela",
    description:
      "Precios en USD y Bs. a tasa BCV. Pago Móvil y Zelle verificados.",
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
