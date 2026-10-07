"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  size: string;
  priceUsd: number; // centavos
  imageId: number | null;
  quantity: number;
};

type CartCtx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: number, size: string) => void;
  setQuantity: (productId: number, size: string, qty: number) => void;
  clear: () => void;
  count: number;
  totalUsd: number; // centavos
};

const Ctx = createContext<CartCtx | null>(null);

const KEY = "sf_cart_v1";

function sameItem(a: CartItem, b: { productId: number; size: string }) {
  return a.productId === b.productId && a.size === b.size;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // carrito corrupto: se descarta
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => sameItem(i, item));
      if (existing) {
        return prev.map((i) =>
          sameItem(i, item) ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      }
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((productId: number, size: string) => {
    setItems((prev) => prev.filter((i) => !sameItem(i, { productId, size })));
  }, []);

  const setQuantity = useCallback(
    (productId: number, size: string, qty: number) => {
      setItems((prev) =>
        prev
          .map((i) => (sameItem(i, { productId, size }) ? { ...i, quantity: qty } : i))
          .filter((i) => i.quantity > 0),
      );
    },
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      add,
      remove,
      setQuantity,
      clear,
      count: items.reduce((s, i) => s + i.quantity, 0),
      totalUsd: items.reduce((s, i) => s + i.priceUsd * i.quantity, 0),
    }),
    [items, add, remove, setQuantity, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
