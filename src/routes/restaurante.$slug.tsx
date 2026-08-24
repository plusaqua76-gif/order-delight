import { createFileRoute, Link } from "@tanstack/react-router";
import { NubexLogo } from "@/components/NubexLogo";

export const Route = createFileRoute("/restaurante/$slug")({
  head: () => ({
    meta: [
      { title: "Servicios de Transporte | Nubex Central de Acarreos" },
      {
        name: "description",
        content:
          "Cotiza tu servicio de acarreo o mudanza en Pitalito con Nubex Central de Acarreos.",
      },
    ],
  }),
  component: RestaurantRedirect,
});

export function RestaurantRedirect() {
  return (
    <main className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="surface-card p-8 rounded-3xl border border-border">
        <NubexLogo size="md" subtitleText="Pitalito, Huila" />
        <h1 className="mt-4 text-xl font-bold text-white">Cotizaciones por WhatsApp</h1>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Atendemos tus requerimientos de carga, mudanza y acarreo en cualquier punto de Pitalito y
          sus alrededores. Escríbenos a nuestra línea oficial.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <a
            href="https://wa.me/573125964567?text=%C2%A1Hola%20Nubex%20Central%20de%20Acarreos!%20Quisiera%20cotizar%20un%20servicio%20en%20Pitalito."
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
