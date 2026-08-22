import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { useStore } from "@/lib/store";
import { ParallaxHero } from "@/components/ParallaxHero";
import { ParallaxCard } from "@/components/ParallaxCard";

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
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(businesses.map((b) => b.category)))],
    [businesses],
  );

  const list = businesses.filter((b) => {
    if (category !== "Todos" && b.category !== category) return false;
    if (onlyOpen && !b.active) return false;
    return b.name.toLowerCase().includes(query.trim().toLowerCase());
  });

  const handleSearchFocus = () => {
    searchInputRef.current?.focus();
    searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <main className="mx-auto max-w-5xl px-4 pb-12 overflow-hidden">
      {/* 3D Multi-Layer Parallax Hero */}
      <ParallaxHero onSearchFocus={handleSearchFocus} />

      {/* Filter and Search Bar with subtle float transition */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-6 space-y-3"
      >
        <div className="relative">
          <input
            ref={searchInputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar restaurante, comida o negocio…"
            className="w-full rounded-2xl border border-border/80 bg-card/80 backdrop-blur-md px-4 py-3.5 pl-11 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full size-6 flex items-center justify-center text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
          {categories.map((c) => (
            <motion.button
              key={c}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                c === category
                  ? "border-cyan-400 bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-black"
                  : "border-border bg-card/80 text-muted-foreground hover:text-foreground hover:border-cyan-400/50"
              }`}
            >
              {c}
            </motion.button>
          ))}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setOnlyOpen((v) => !v)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
              onlyOpen
                ? "border-emerald-400 bg-emerald-500 text-black font-black shadow-md shadow-emerald-500/20"
                : "border-border bg-card/80 text-muted-foreground hover:text-foreground hover:border-emerald-400/50"
            }`}
          >
            Solo abiertos
          </motion.button>
        </div>
      </motion.section>

      {/* Grid of Partner Restaurants with 3D Parallax Tilt Cards */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-base font-extrabold text-white flex items-center gap-2">
            <span>Restaurantes Aliados</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {list.length}
            </span>
          </h2>
          <span className="text-xs text-cyan-400/80 font-medium">
            Tarifa fija de domicilio $6.000
          </span>
        </div>

        <motion.div layout className="grid gap-3.5 sm:grid-cols-2">
          {list.map((b, index) => {
            const count = products.filter((p) => p.businessId === b.id && p.active).length;
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <ParallaxCard tiltIntensity={5}>
                  <Link
                    to="/restaurante/$slug"
                    params={{ slug: b.slug }}
                    className="surface-card flex items-center gap-4 p-4 size-full group relative overflow-hidden border border-border/80 hover:border-cyan-400/40 transition-colors"
                  >
                    {/* Restaurant Logo / Visual Avatar */}
                    {b.logoUrl ? (
                      <div className="relative size-15 shrink-0 overflow-hidden rounded-2xl border border-border shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={b.logoUrl}
                          alt={b.name}
                          className="size-full object-cover"
                          style={{ opacity: b.active ? 1 : 0.5 }}
                        />
                        <span className="absolute bottom-0 right-0 rounded-tl-md bg-black/70 px-1.5 py-0.5 text-[10px]">
                          {b.emoji}
                        </span>
                      </div>
                    ) : (
                      <span
                        className="grid size-15 shrink-0 place-items-center rounded-2xl text-2xl shadow-inner group-hover:scale-105 transition-transform duration-300"
                        style={{ backgroundColor: b.color, opacity: b.active ? 1 : 0.5 }}
                      >
                        {b.emoji}
                      </span>
                    )}

                    {/* Restaurant Info */}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-display font-extrabold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors">
                          {b.name}
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            b.active
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {b.active ? "Abierto" : "Pausado"}
                        </span>
                      </span>

                      <span className="mt-1 block text-xs text-muted-foreground">
                        {b.category} · {count} productos disponibles
                      </span>

                      <span className="mt-1.5 flex items-center gap-1.5 text-xs text-cyan-200/70 font-medium">
                        <span>🕒 {b.schedule}</span>
                      </span>
                    </span>

                    <span className="text-xl text-muted-foreground group-hover:text-cyan-400 group-hover:translate-x-1 transition-all">
                      ›
                    </span>
                  </Link>
                </ParallaxCard>
              </motion.div>
            );
          })}
        </motion.div>

        {list.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="surface-card p-8 text-center text-sm text-muted-foreground rounded-2xl border border-dashed border-border mt-3"
          >
            <p className="text-2xl mb-2">🍽️</p>
            <p className="font-semibold text-white">No encontramos negocios con esos filtros</p>
            <p className="text-xs text-muted-foreground mt-1">
              Prueba con otra palabra o categoría.
            </p>
          </motion.div>
        )}
      </section>
    </main>
  );
}
