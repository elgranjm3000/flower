"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { formatBs, formatUsd, usdToBs } from "@/lib/money";

type CurrencyMode = "both" | "usd" | "bs";

type CurrencyCtx = {
  mode: CurrencyMode;
  setMode: (m: CurrencyMode) => void;
  bcvRateCents: number;
  /** Renderiza el precio (centavos USD) según el modo activo. */
  price: (centsUsd: number) => ReactNode;
};

const Ctx = createContext<CurrencyCtx | null>(null);

export function CurrencyProvider({
  children,
  bcvRateCents,
}: {
  children: ReactNode;
  bcvRateCents: number;
}) {
  const [mode, setModeState] = useState<CurrencyMode>("both");

  useEffect(() => {
    const saved = localStorage.getItem("sf_currency");
    if (saved === "usd" || saved === "bs" || saved === "both") setModeState(saved);
  }, []);

  const setMode = useCallback((m: CurrencyMode) => {
    setModeState(m);
    localStorage.setItem("sf_currency", m);
  }, []);

  const price = useCallback(
    (centsUsd: number) => {
      if (mode === "usd") return <>{formatUsd(centsUsd)}</>;
      if (mode === "bs")
        return <>{formatBs(usdToBs(centsUsd, bcvRateCents))}</>;
      return (
        <>
          {formatUsd(centsUsd)}
          <span className="ml-2 text-xs font-semibold text-slate-body">
            {formatBs(usdToBs(centsUsd, bcvRateCents))}
          </span>
        </>
      );
    },
    [mode, bcvRateCents],
  );

  return (
    <Ctx.Provider value={{ mode, setMode, bcvRateCents, price }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCurrency(): CurrencyCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCurrency debe usarse dentro de CurrencyProvider");
  return ctx;
}

export function CurrencyToggle() {
  const { mode, setMode } = useCurrency();
  const options: { key: CurrencyMode; label: string }[] = [
    { key: "both", label: "Ambos" },
    { key: "usd", label: "$ USD" },
    { key: "bs", label: "Bs." },
  ];
  return (
    <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => setMode(o.key)}
          className={`rounded-full px-3 py-0.5 text-xs font-bold transition-colors ${
            mode === o.key
              ? "bg-gold text-navy"
              : "text-white/70 hover:text-white"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
