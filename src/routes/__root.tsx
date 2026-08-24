import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { NubexLogo } from "@/components/NubexLogo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La dirección que buscas no existe o ha sido movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-black text-black transition-colors hover:bg-cyan-400"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Hubo un problema al cargar esta página
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Puedes intentar recargar la página o volver a la página principal.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-4 py-2 text-xs font-black text-black transition-colors hover:bg-cyan-400"
          >
            Reintentar
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-input bg-card px-4 py-2 text-xs font-bold text-foreground transition-colors hover:bg-accent"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Domicilios Nubex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=DM+Sans:wght@400;500;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteHeader />
      <Outlet />
      <SiteFooter />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

function SiteHeader() {
  const waContactUrl =
    "https://wa.me/573125964567?text=" +
    encodeURIComponent(
      "¡Hola Nubex Central de Acarreos! Quisiera solicitar información sobre un servicio de acarreo o transporte en Pitalito.",
    );

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="group flex items-center transition-transform hover:scale-[1.01]">
          <NubexLogo size="md" subtitleText="Pitalito · Huila" />
        </Link>

        {/* Informative navigation links */}
        <nav className="hidden sm:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
          <Link to="/" className="hover:text-cyan-300 transition-colors">
            Inicio
          </Link>
          <a href="#contacto" className="hover:text-cyan-300 transition-colors">
            Contacto
          </a>
        </nav>

        {/* WhatsApp Direct Contact Button */}
        <a
          href={waContactUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-[#00AEFF] px-4 py-2 text-xs font-black text-black shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02] hover:brightness-105 active:scale-[0.98]"
        >
          <span>WhatsApp Central</span>
          <span className="text-sm">💬</span>
        </a>
      </div>
    </header>
  );
}

function SiteFooter() {
  const waContactUrl =
    "https://wa.me/573125964567?text=" +
    encodeURIComponent(
      "¡Hola Nubex Central de Acarreos! Me gustaría consultar sobre sus servicios de acarreo y transporte.",
    );

  return (
    <footer className="mt-20 border-t border-border/70 bg-secondary/30 py-12 text-center text-xs text-muted-foreground">
      <div className="mx-auto max-w-5xl px-4 flex flex-col items-center justify-center gap-4">
        <NubexLogo size="sm" showSubtitle={false} />
        <div>
          <p className="font-bold text-foreground text-sm">
            Nubex Central de Acarreos · Pitalito, Huila
          </p>
          <p className="mt-1 text-muted-foreground">
            Servicio confiable de acarreos, mudanzas y transporte de carga para todo el Valle de
            Laboyos.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-medium text-cyan-200/90">
          <span>🕒 Lunes a Domingo: 7:00 AM – 11:00 PM</span>
          <span>·</span>
          <span>📍 Pitalito, Huila - Colombia</span>
          <span>·</span>
          <a
            href={waContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline font-bold"
          >
            WhatsApp: +57 312 596 4567
          </a>
        </div>

        <div className="mt-4 border-t border-border/50 pt-6 w-full text-[11px] text-muted-foreground/70">
          <p>
            © {new Date().getFullYear()} Nubex Central de Acarreos. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
