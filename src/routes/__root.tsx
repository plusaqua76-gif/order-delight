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
import { useState } from "react";
import { Menu, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { NubexLogo } from "@/components/NubexLogo";
import { MobileMenuDrawer, MobileBottomNavigation } from "@/components/MobileNavigation";
import {
  TopPageProgressBar,
  PageTransitionWrapper,
  useActiveSection,
  scrollToSection,
} from "@/components/PageTransition";
import { FloatingQuickNavigation } from "@/components/FloatingNavigation";

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
      { name: "author", content: "Nubex Central de Acarreos" },
      { name: "theme-color", content: "#00E5FF" },
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
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "alternate icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TopPageProgressBar />
      <SiteHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      <MobileMenuDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="pb-16 md:pb-0 min-h-[calc(100vh-64px)]">
        <PageTransitionWrapper>
          <Outlet />
        </PageTransitionWrapper>
      </div>
      <FloatingQuickNavigation />
      <MobileBottomNavigation onOpenMenu={() => setIsMobileMenuOpen(true)} />
      <SiteFooter />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

function SiteHeader({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  const activeSection = useActiveSection(["pedir-acarreo", "contacto"]);

  const waContactUrl =
    "https://wa.me/573125964567?text=" +
    encodeURIComponent(
      "¡Hola Nubex Central de Acarreos! Quisiera solicitar información sobre un servicio de acarreo o transporte en Pitalito.",
    );

  const navItems = [
    { id: "", label: "Inicio", icon: "🏠", isRoute: true, href: "/" },
    {
      id: "pedir-acarreo",
      label: "Pide tu Acarreo",
      icon: "🚚",
      isRoute: false,
      href: "#pedir-acarreo",
    },
    { id: "contacto", label: "Información", icon: "ℹ️", isRoute: false, href: "#contacto" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 py-2">
        {/* Left side: Logo + Desktop Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 min-w-0">
          <Link
            to="/"
            className="group flex items-center transition-transform hover:scale-[1.01] shrink-0"
          >
            <NubexLogo
              size="sm"
              className="sm:hidden"
              showSubtitle={false}
              categoryText="ACARREOS"
            />
            <NubexLogo size="md" className="hidden sm:flex" subtitleText="Pitalito · Huila" />
          </Link>

          <div className="hidden h-5 w-px bg-border/80 md:block shrink-0" />

          {/* Desktop Navigation Links con indicador activo animado */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-muted-foreground shrink-0 py-1">
            {navItems.map((item) => {
              const isActive = item.id === "" ? activeSection === "" : activeSection === item.id;

              if (item.isRoute) {
                return (
                  <Link
                    key={item.label}
                    to="/"
                    className={`relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs transition-colors whitespace-nowrap ${
                      isActive
                        ? "text-cyan-300 font-black"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeHeaderNav"
                        className="absolute inset-0 rounded-xl bg-cyan-950/70 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.icon}</span>
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs transition-colors whitespace-nowrap ${isActive ? "text-cyan-300 font-black" : "text-muted-foreground hover:text-white"}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeHeaderNav"
                      className="absolute inset-0 rounded-xl bg-cyan-950/70 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Right side: Action button + Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Direct CTA button (visible on all screens) */}
          <a
            href="#pedir-acarreo"
            onClick={(e) => scrollToSection(e, "pedir-acarreo")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-[#00E5FF] to-[#00AEFF] px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-black text-black shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02] hover:brightness-105 active:scale-[0.98] whitespace-nowrap cursor-pointer"
          >
            <span>Pide tu Acarreo</span>
            <span className="text-sm">🚚</span>
          </a>

          {/* WhatsApp Direct (Hidden on very small screens, visible on tablet/desktop) */}
          <a
            href={waContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all active:scale-95 cursor-pointer"
            title="Contactar por WhatsApp"
          >
            <MessageCircle className="size-4" />
          </a>

          {/* Mobile Hamburger Button (Menú para celular) */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Abrir menú de navegación móvil"
            className="flex md:hidden items-center justify-center size-10 rounded-xl bg-white/5 hover:bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-16 sm:mt-20 border-t border-border/70 bg-secondary/30 py-10 sm:py-12 text-center text-xs text-muted-foreground">
      <div className="mx-auto max-w-5xl px-4 flex flex-col items-center justify-center gap-4">
        <NubexLogo size="sm" showSubtitle={false} />
        <div>
          <p className="font-bold text-foreground text-sm">
            Nubex Central de Acarreos · Pitalito, Huila
          </p>
          <p className="mt-1 text-muted-foreground text-xs max-w-md mx-auto">
            Servicio confiable de acarreos, mudanzas y transporte de carga para todo el Valle de
            Laboyos.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2 text-xs font-medium text-cyan-200/90">
          <span>🕒 Lunes a Domingo: 7:00 AM – 11:00 PM</span>
          <span className="hidden sm:inline">·</span>
          <span>📍 Pitalito, Huila - Colombia</span>
          <span className="hidden sm:inline">·</span>
          <a href="#pedir-acarreo" className="text-cyan-400 hover:underline font-bold">
            🚚 Pide tu Acarreo Aquí
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
