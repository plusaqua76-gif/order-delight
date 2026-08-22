import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { cop } from "@/lib/format";
import { DELIVERY_FEE } from "@/data/demo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Domicilios Nubex Pitalito | Pide comida por WhatsApp" },
      {
        name: "description",
        content:
          "Pide de los mejores restaurantes de Pitalito, Huila. Arma tu pedido y confírmalo por WhatsApp. Domicilio fijo $6.000.",
      },
      { property: "og:title", content: "Domicilios Nubex Pitalito | Pide por WhatsApp" },
      {
        property: "og:description",
        content: "Restaurantes aliados en Pitalito, Huila. Pedido rápido con envío fijo de $6.000.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { businesses, products } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [onlyOpen, setOnlyOpen] = useState(false);

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(businesses.map((b) => b.category)))],
    [businesses],
  );

  const list = businesses.filter((b) => {
    if (category !== "Todos" && b.category !== category) return false;
    if (onlyOpen && !b.active) return false;
    return b.name.toLowerCase().includes(query.trim().toLowerCase());
  });

  return (
    <main className="mx-auto max-w-5xl px-4 pb-10">
      <section className="hero-gradient mt-4 rounded-3xl px-5 py-8 text-primary-foreground shadow-[var(--shadow-lift)] sm:px-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-90">
          Pitalito · Huila
        </p>
        <h1 className="mt-2 max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">
          Tu antojo llega en minutos con Domicilios Nubex
        </h1>
        <p className="mt-3 max-w-md text-sm opacity-95">
          Elige tu restaurante aliado, arma el pedido y confírmalo por WhatsApp. Domicilio fijo de{" "}
          {cop(DELIVERY_FEE)} en toda la ciudad.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar restaurante o negocio…"
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                c === category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
          <button
            onClick={() => setOnlyOpen((v) => !v)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
              onlyOpen
                ? "border-success bg-success text-success-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            Solo abiertos
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        <h2 className="sr-only">Negocios aliados</h2>
        {list.map((b) => {
          const count = products.filter((p) => p.businessId === b.id && p.active).length;
          return (
            <Link
              key={b.id}
              to="/restaurante/$slug"
              params={{ slug: b.slug }}
              className="surface-card lift-hover flex items-center gap-4 p-4"
            >
              <span
                className="grid size-14 shrink-0 place-items-center rounded-2xl text-2xl"
                style={{ backgroundColor: b.color, opacity: b.active ? 1 : 0.5 }}
              >
                {b.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate font-display font-bold">{b.name}</span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      b.active
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {b.active ? "Abierto" : "Pausado"}
                  </span>
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {b.category} · {count} productos
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">🕒 {b.schedule}</span>
              </span>
              <span className="text-lg text-muted-foreground">›</span>
            </Link>
          );
        })}
        {list.length === 0 && (
          <p className="surface-card p-6 text-center text-sm text-muted-foreground">
            No encontramos negocios con esos filtros.
          </p>
        )}
      </section>
    </main>
  );
}
