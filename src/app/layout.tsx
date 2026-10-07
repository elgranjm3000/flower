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
    "En Sunflower by Company te vestimos a tu medida: moda dama y caballero seleccionada para que te veas y te sientas increíble. Envíos a toda Venezuela.",
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
      "Te vestimos a tu medida. Moda dama y caballero pensada para que te veas bien en cada ocasión.",
    images: [
      { url: "/brand-logo.jpg", width: 1165, height: 665, alt: "Sunflower by Company — Men & Women's Apparel" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunflower by Company | Ropa de Dama y Caballero",
    description:
      "Sunflower by Company te vestimos a tu medida — nos encanta hacer que te veas bien. Moda dama y caballero.",
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
