import Link from "next/link";

export function Footer({ storeName }: { storeName: string }) {
  return (
    <footer className="mt-16 bg-navy text-white">
      <div className="container-sf grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 text-lg font-extrabold">
            🌻 {storeName}
          </p>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Moda con estilo y autenticidad. Precios en dólares y bolívares a
            tasa oficial BCV, con envíos a toda Venezuela.
          </p>
          <p className="mt-4 text-xs text-white/50">
            Horario: Lun–Sáb 8:30 AM – 6:30 PM
          </p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-gold">Catálogo</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><Link href="/productos?department=damas" className="hover:text-white">Damas</Link></li>
            <li><Link href="/productos?department=caballeros" className="hover:text-white">Caballeros</Link></li>
            <li><Link href="/productos?department=calzado" className="hover:text-white">Calzado</Link></li>
            <li><Link href="/productos?department=accesorios" className="hover:text-white">Accesorios</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-gold">Atención</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>Cómo comprar</li>
            <li>Envíos MRW / Zoom / Tealca</li>
            <li>Pago Móvil y Zelle verificados</li>
            <li>Términos y condiciones</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-gold">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>💬 WhatsApp 24/7</li>
            <li>✉️ ventas@sunflower.com</li>
            <li>📍 Caracas, Venezuela</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-sf flex flex-col gap-1 py-4 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {storeName}. Todos los derechos reservados.</p>
          <p>Precios en Bs. calculados a la tasa oficial BCV del día.</p>
        </div>
      </div>
    </footer>
  );
}
