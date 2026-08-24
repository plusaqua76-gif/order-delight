import { createFileRoute, Link } from "@tanstack/react-router";
import { NubexLogo } from "@/components/NubexLogo";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Solicitud de Servicios | Nubex Central de Acarreos" },
      {
        name: "description",
        content:
          "Solicita tu servicio de acarreo o transporte directamente por WhatsApp con Nubex Central de Acarreos en Pitalito.",
      },
    ],
  }),
  component: CheckoutRedirect,
});

export function CheckoutRedirect() {
  return (
    <main className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="surface-card p-8 rounded-3xl border border-border">
        <NubexLogo size="md" subtitleText="Pitalito, Huila" />
        <h1 className="mt-4 text-xl font-bold text-white">Solicitudes por WhatsApp</h1>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Para brindarte una cotización rápida y personalizada, todos los servicios de acarreos y
          mudanzas se atienden directamente a través de nuestra línea central de WhatsApp en
          Pitalito.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <a
            href="https://wa.me/573125964567?text=%C2%A1Hola%20Nubex%20Central%20de%20Acarreos!%20Quiero%20solicitar%20un%20servicio%20en%20Pitalito."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 py-3 text-xs font-black text-black hover:bg-cyan-400"
          >
            Cotizar por WhatsApp (+57 312 596 4567) 💬
          </a>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-border py-2.5 text-xs font-bold text-white hover:bg-muted"
          >
            Volver a la Página Principal
          </Link>
        </div>
      </div>
    </main>
  );
}
