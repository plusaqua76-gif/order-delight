import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { StoreProvider, useStore } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";
import { NubexLogo } from "@/components/NubexLogo";
import { RoleAuthModal } from "@/components/RoleAuthModal";

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
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
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
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Reintentar
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
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
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=DM+Sans:wght@400;500;700&display=swap",
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
    <html lang="es">
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
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <SiteHeader onOpenAuth={() => setAuthModalOpen(true)} />
        <Outlet />
        <SiteFooter onOpenAuth={() => setAuthModalOpen(true)} />
        <RoleAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        <Toaster position="top-center" richColors />
      </StoreProvider>
    </QueryClientProvider>
  );
}

function SiteHeader({ onOpenAuth }: { onOpenAuth: () => void }) {
  const { currentUser } = useStore();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
        <Link to="/" className="group flex items-center transition-transform hover:scale-[1.02]">
          <NubexLogo size="md" subtitleText="Pitalito, Huila" />
        </Link>
        <div className="flex items-center gap-2">
          {currentUser ? (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 text-xs font-bold text-cyan-300 transition-colors hover:bg-cyan-900/50"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              <span className="uppercase text-[11px]">{currentUser.role}</span>
            </Link>
          ) : (
            <Link
              to="/admin"
              className="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Acceso Admin
            </Link>
          )}
          <CartButton />
        </div>
      </div>
    </header>
  );
}

function CartButton() {
  const { itemCount } = useStore();
  return (
    <Link
      to="/checkout"
      className="relative inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
    >
      🛒 Carrito
      {itemCount > 0 && (
        <span className="grid min-w-5 place-items-center rounded-full bg-background px-1 text-[11px] font-extrabold text-primary">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

function SiteFooter({ onOpenAuth }: { onOpenAuth: () => void }) {
  return (
    <footer className="mt-16 border-t border-border/70 py-8 text-center text-xs text-muted-foreground">
      <div className="mx-auto flex flex-col items-center justify-center gap-2">
        <NubexLogo size="sm" showSubtitle={false} />
        <p className="font-semibold text-foreground">Domicilios Nubex · Pitalito, Huila</p>
        <p className="text-muted-foreground">
          Pedidos directos por WhatsApp · Tarifa fija urbana $6.000 COP
        </p>

        <div className="mt-3 flex items-center justify-center gap-4 text-[11px]">
          <button
            onClick={onOpenAuth}
            className="text-muted-foreground hover:text-cyan-400 font-semibold underline underline-offset-4 transition-colors"
          >
            🔑 Ingreso por Correo / Roles
          </button>
          <span>·</span>
          <Link
            to="/admin"
            className="text-muted-foreground hover:text-cyan-400 font-semibold underline underline-offset-4 transition-colors"
          >
            Panel Administrativo
          </Link>
        </div>
      </div>
    </footer>
  );
}
