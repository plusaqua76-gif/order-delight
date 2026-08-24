import { createFileRoute } from "@tanstack/react-router";
import { NubexLogo } from "@/components/NubexLogo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nubex Central de Acarreos | Acarreos, Mudanzas y Transporte en Pitalito" },
      {
        name: "description",
        content:
          "Plataforma oficial informativa de Nubex Central de Acarreos en Pitalito, Huila. Servicios de acarreos, mudanzas y transporte de carga con atención directa por WhatsApp.",
      },
      {
        property: "og:title",
        content: "Nubex Central de Acarreos | Pitalito, Huila",
      },
      {
        property: "og:description",
        content:
          "Servicio de acarreos, mudanzas y transporte confiable en Pitalito, Huila. Atención directa por WhatsApp.",
      },
    ],
  }),
  component: Home,
});

const CENTRAL_PHONE = "573125964567";

const waUrl = (msg: string) => `https://wa.me/${CENTRAL_PHONE}?text=${encodeURIComponent(msg)}`;

export function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 pb-16">
      {/* 1. HERO SECTION */}
      <section className="hero-gradient relative overflow-hidden mt-4 sm:mt-6 rounded-3xl p-6 sm:p-10 md:p-12 text-primary-foreground shadow-[var(--shadow-lift)]">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-cyan-200 border border-cyan-400/30">
              <span className="size-2 rounded-full bg-[#00E5FF] animate-ping" />
              <span>Pitalito · Huila · Servicio Activo</span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.15] text-white">
              Tu servicio de{" "}
              <span className="bg-gradient-to-r from-white via-cyan-200 to-[#38BDF8] bg-clip-text text-transparent">
                acarreos y mudanzas
              </span>{" "}
              de confianza en Pitalito
            </h1>

            <p className="mt-4 text-sm sm:text-base text-cyan-100/90 leading-relaxed max-w-xl">
              Coordinamos acarreos, transporte de carga liviana y pesada, mudanzas urbanas y rurales
              en todo el Valle de Laboyos. Cotiza y solicita tu servicio al instante por WhatsApp
              con <strong className="text-white font-extrabold">Nubex Central de Acarreos</strong>.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={waUrl(
                  "¡Hola Nubex Central de Acarreos! Quiero solicitar información o cotizar un servicio de acarreo en Pitalito.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-xs sm:text-sm font-black text-black shadow-lg shadow-cyan-400/25 transition-all hover:bg-cyan-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Cotizar Acarreo por WhatsApp</span>
                <span className="text-base">💬</span>
              </a>

              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/40 bg-black/30 backdrop-blur px-5 py-3.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-white/10"
              >
                <span>Información de Contacto</span>
                <span>↓</span>
              </a>
            </div>

            {/* Feature Highlights Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-cyan-400/20">
              <div>
                <p className="text-xl sm:text-2xl font-black text-cyan-300">7 am – 11 pm</p>
                <p className="text-[11px] text-cyan-200/80 font-medium">Lunes a Domingo</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">Pitalito</p>
                <p className="text-[11px] text-cyan-200/80 font-medium">Urbano y Rural</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xl sm:text-2xl font-black text-cyan-300">WhatsApp</p>
                <p className="text-[11px] text-cyan-200/80 font-medium">Atención inmediata</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center justify-center p-8 rounded-3xl bg-black/30 backdrop-blur-md border border-cyan-400/30 shadow-2xl shrink-0">
            <NubexLogo size="xl" subtitleText="Pitalito · Huila" />
            <div className="mt-4 rounded-xl bg-cyan-950/60 border border-cyan-500/30 px-4 py-2 text-center">
              <p className="text-xs font-bold text-cyan-300">Línea Oficial Central:</p>
              <p className="text-sm font-mono font-black text-white">+57 312 596 4567</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTACTO DIRECTO */}
      <section id="contacto" className="mt-16 scroll-mt-24">
        <div className="surface-card p-8 sm:p-10 rounded-3xl border border-cyan-500/30 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Canal Oficial
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            ¿Necesitas comunicarte con nosotros?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            Escríbenos directamente a la línea central de WhatsApp en Pitalito para cotizar tu
            servicio de acarreo, mudanza o transporte de carga.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={waUrl("¡Hola Nubex Central de Acarreos! Quisiera cotizar un servicio.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-xs sm:text-sm font-black text-black shadow-lg transition-transform hover:scale-[1.02]"
            >
              <span>Escribir al WhatsApp (+57 312 596 4567)</span>
              <span className="text-base">💬</span>
            </a>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4 text-xs text-muted-foreground pt-6 border-t border-border/60">
            <div className="rounded-2xl bg-card/60 p-4 border border-border">
              <p className="font-bold text-white mb-1">📍 Ubicación</p>
              <p>Pitalito, Huila · Colombia</p>
            </div>
            <div className="rounded-2xl bg-card/60 p-4 border border-border">
              <p className="font-bold text-white mb-1">🕒 Horario</p>
              <p>Lunes a Domingo: 7:00 AM – 11:00 PM</p>
            </div>
            <div className="rounded-2xl bg-card/60 p-4 border border-border">
              <p className="font-bold text-white mb-1">💬 Atención</p>
              <p>WhatsApp Central Oficial</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
