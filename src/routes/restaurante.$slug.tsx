import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { cop } from "@/lib/format";
import { ParallaxCard } from "@/components/ParallaxCard";

export const Route = createFileRoute("/restaurante/$slug")({
  head: ({ params }) => {
    const title = `Menú del restaurante | Domicilios Nubex Pitalito`;
    const description = `Carta y precios de ${params.slug.replace(/-/g, " ")} en Pitalito. Pide por WhatsApp con domicilio fijo de $6.000.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: RestaurantPage,
  notFoundComponent: () => (
    <main className="mx-auto max-w-5xl px-4 py-16 text-center">
      <h1 className="text-xl font-bold">Restaurante no encontrado</h1>
      <Link to="/" className="mt-4 inline-block text-sm font-semibold text-primary">
        Volver al inicio
      </Link>
    </main>
  ),
});

function RestaurantPage() {
  const { slug } = Route.useParams();
  const { businesses, products, addToCart, itemCount } = useStore();
  const business = businesses.find((b) => b.slug === slug);
  const [openId, setOpenId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  const headerRef = useRef<HTMLDivElement>(null);

  // Parallax scroll for restaurant banner
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });

  const bannerBgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  // Mouse tilt for header
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 150,
    damping: 20,
  });

  const handleHeaderMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleHeaderMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const menu = useMemo(() => {
    if (!business) return [];
    const items = products.filter((p) => p.businessId === business.id && p.active);
    const cats = Array.from(new Set(items.map((i) => i.category)));
    return cats.map((c) => ({ category: c, items: items.filter((i) => i.category === c) }));
  }, [business, products]);

  if (!business) throw notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-28">
      {/* Breadcrumb navigation */}
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-cyan-400 transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <span className="text-white font-semibold">{business.name}</span>
      </div>

      {/* 3D Parallax Restaurant Header Card */}
      <div
        ref={headerRef}
        onMouseMove={handleHeaderMouseMove}
        onMouseLeave={handleHeaderMouseLeave}
        className="perspective-[1000px] mt-3"
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="surface-card relative overflow-hidden rounded-3xl p-5 sm:p-6 border border-border/80 shadow-xl bg-gradient-to-br from-card via-card to-secondary/30 transition-shadow duration-300"
        >
          {/* Background ambient glow with parallax */}
          <motion.div
            style={{ y: bannerBgY }}
            className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-cyan-500/10 blur-2xl"
          />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {business.logoUrl ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative size-18 sm:size-20 shrink-0 overflow-hidden rounded-2xl border border-cyan-500/30 shadow-md"
                >
                  <img
                    src={business.logoUrl}
                    alt={business.name}
                    className="size-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 rounded-tl-md bg-black/70 px-1.5 py-0.5 text-xs">
                    {business.emoji}
                  </span>
                </motion.div>
              ) : (
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="grid size-18 sm:size-20 shrink-0 place-items-center rounded-2xl text-4xl shadow-inner border border-white/10"
                  style={{ backgroundColor: business.color }}
                >
                  {business.emoji}
                </motion.span>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-xl sm:text-2xl font-black text-white">
                    {business.name}
                  </h1>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      business.active
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {business.active ? "Abierto" : "Pausado"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {business.category} · 🕒 {business.schedule}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 text-xs font-bold text-cyan-300">
                    <span>🛵</span>
                    <span>Domicilio {cop(business.deliveryFee)}</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">Pitalito, Huila</span>
                </div>
              </div>
            </div>

            {/* Quick Alliance Badge */}
            <div className="hidden sm:flex flex-col items-end text-right border-l border-border/60 pl-5">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Despacho Oficial
              </span>
              <span className="text-xs font-bold text-white mt-0.5">Domicilios Nubex</span>
              <span className="text-[11px] text-muted-foreground">Atención WhatsApp ⚡</span>
            </div>
          </div>
        </motion.div>
      </div>

      {!business.active && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3.5 text-center text-xs font-semibold text-amber-200"
        >
          ⚠️ Este negocio está en pausa temporalmente. Puedes explorar la carta, pero no recibe
          pedidos en este instante.
        </motion.p>
      )}

      {/* Menu Categories with Parallax Cards */}
      {menu.map((group, gIdx) => (
        <motion.section
          key={group.category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: gIdx * 0.1 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2 mb-3.5 border-b border-border/60 pb-2">
            <h2 className="font-display text-lg font-black text-white">{group.category}</h2>
            <span className="text-xs text-muted-foreground font-medium">
              ({group.items.length})
            </span>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            {group.items.map((item) => (
              <ParallaxCard key={item.id} tiltIntensity={4}>
                <article className="surface-card p-4 rounded-2xl border border-border/80 hover:border-cyan-400/30 transition-colors size-full flex flex-col justify-between">
                  <div className="flex gap-3">
                    <span className="grid size-13 shrink-0 place-items-center rounded-xl bg-secondary/80 text-2xl border border-border/60">
                      {item.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-sm font-bold text-white">{item.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <p className="mt-2 text-sm font-extrabold text-cyan-300">{cop(item.price)}</p>
                    </div>
                  </div>

                  {openId === item.id ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 space-y-3 border-t border-border pt-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground">Cantidad:</span>
                        <div className="flex items-center gap-2 bg-background/80 rounded-lg p-1 border border-border">
                          <button
                            onClick={() => setQty((q) => Math.max(1, q - 1))}
                            className="size-7 rounded-md bg-secondary hover:bg-muted font-bold text-white transition-colors"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white">
                            {qty}
                          </span>
                          <button
                            onClick={() => setQty((q) => q + 1)}
                            className="size-7 rounded-md bg-secondary hover:bg-muted font-bold text-white transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={2}
                        placeholder="Nota especial (ej. sin cebolla, término 3/4…)"
                        className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder:text-muted-foreground/70"
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={() => setOpenId(null)}
                          className="w-1/3 rounded-xl border border-border bg-secondary py-2.5 text-xs font-bold text-muted-foreground hover:text-white"
                        >
                          Cancelar
                        </button>
                        <button
                          disabled={!business.active}
                          onClick={() => {
                            addToCart({
                              productId: item.id,
                              businessId: business.id,
                              name: item.name,
                              price: item.price,
                              qty,
                              note,
                            });
                            toast.success(`${item.name} agregado al pedido`);
                            setOpenId(null);
                            setQty(1);
                            setNote("");
                          }}
                          className="flex-1 rounded-xl bg-cyan-500 py-2.5 text-xs font-black text-black disabled:opacity-50 shadow-md shadow-cyan-500/20 hover:bg-cyan-400 transition-colors"
                        >
                          Agregar · {cop(item.price * qty)}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <button
                      disabled={!business.active}
                      onClick={() => {
                        setOpenId(item.id);
                        setQty(1);
                        setNote("");
                      }}
                      className="mt-3.5 w-full rounded-xl border border-cyan-500/40 bg-cyan-500/10 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-40 disabled:pointer-events-none"
                    >
                      + Agregar al pedido
                    </button>
                  )}
                </article>
              </ParallaxCard>
            ))}
          </div>
        </motion.section>
      ))}

      {menu.length === 0 && (
        <p className="surface-card mt-6 p-6 text-center text-sm text-muted-foreground rounded-2xl">
          Este negocio aún no tiene productos en su carta.
        </p>
      )}

      {/* Floating Checkout Bar with spring bounce */}
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3.5 backdrop-blur-lg shadow-2xl"
        >
          <Link
            to="/checkout"
            className="mx-auto flex max-w-md items-center justify-between rounded-2xl bg-cyan-500 px-5 py-3.5 text-sm font-black text-black shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-black text-xs font-black text-white">
                {itemCount}
              </span>
              <span>Ver Pedido</span>
            </div>
            <span className="text-base font-black">Continuar al WhatsApp →</span>
          </Link>
        </motion.div>
      )}
    </main>
  );
}
