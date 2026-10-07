import { getBcvRateCents, getSettings } from "@/lib/settings";
import { CurrencyProvider } from "@/components/store/currency-provider";
import { CartProvider } from "@/components/store/cart-provider";
import { FloatingWhatsApp, Header } from "@/components/store/header";
import { Footer } from "@/components/store/footer";

export default async function StoreLayout({
  children,
}: { children: React.ReactNode }) {
  const [settings, bcvRateCents] = await Promise.all([
    getSettings(),
    getBcvRateCents(),
  ]);

  return (
    <CurrencyProvider bcvRateCents={bcvRateCents}>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <Header
            storeName={settings.store_name}
            bcvRate={settings.bcv_rate}
            whatsapp={settings.whatsapp}
          />
          <main className="flex-1">{children}</main>
          <Footer storeName={settings.store_name} />
          <FloatingWhatsApp whatsapp={settings.whatsapp} />
        </div>
      </CartProvider>
    </CurrencyProvider>
  );
}
