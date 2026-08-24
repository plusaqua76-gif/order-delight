import { createFileRoute, Link } from "@tanstack/react-router";
import { NubexLogo } from "@/components/NubexLogo";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Portal Informativo | Nubex Central de Acarreos" },
      {
        name: "description",
        content: "Sitio web informativo oficial de Nubex Central de Acarreos en Pitalito, Huila.",
      },
    ],
  }),
  component: AdminRedirect,
});

export function AdminRedirect() {
  return (
    <main className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="surface-card p-8 rounded-3xl border border-border">
        <NubexLogo size="md" subtitleText="Pitalito, Huila" />
        <h1 className="mt-4 text-xl font-bold text-white">Portal Informativo Oficial</h1>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Nuestros canales de atención, cotizaciones y coordinación de acarreos operan directamente
          a través de nuestra línea oficial de WhatsApp en Pitalito.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 py-3 text-xs font-black text-black hover:bg-cyan-400"
          >
            Volver a la Página Principal
          </Link>
          <a
            href="https://wa.me/573125964567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-border py-2.5 text-xs font-bold text-white hover:bg-muted"
          >
            Contactar por WhatsApp (+57 312 596 4567)
          </a>
        </div>
      </div>
    </main>
  );
}
