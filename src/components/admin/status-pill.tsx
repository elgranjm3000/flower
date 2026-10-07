export function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-gray-100 text-gray-700",
    verifying: "bg-amber-100 text-amber-800",
    paid: "bg-green-100 text-green-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    pending: "Pendiente",
    verifying: "Por verificar",
    paid: "Pagado",
    shipped: "Despachado",
    delivered: "Entregado",
    cancelled: "Cancelado",
  };
  return (
    <span className={`badge-sf ${styles[status] ?? "bg-gray-100 text-gray-700"}`}>
      {labels[status] ?? status}
    </span>
  );
}
