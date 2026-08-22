import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { cop } from "@/lib/format";

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

  const menu = useMemo(() => {
    if (!business) return [];
    const items = products.filter((p) => p.businessId === business.id && p.active);
    const cats = Array.from(new Set(items.map((i) => i.category)));
    return cats.map((c) => ({ category: c, items: items.filter((i) => i.category === c) }));
  }, [business, products]);

  if (!business) throw notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-28">
      <div className="surface-card mt-4 flex items-center gap-4 p-4">
        {business.logoUrl ? (
          <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-border shadow-sm">
            <img src={business.logoUrl} alt={business.name} className="size-full object-cover" />
            <span className="absolute bottom-0 right-0 rounded-tl-md bg-black/60 px-1 text-xs">
              {business.emoji}
            </span>
          </div>
        ) : (
          <span
            className="grid size-16 shrink-0 place-items-center rounded-2xl text-3xl"
            style={{ backgroundColor: business.color }}
          >
            {business.emoji}
          </span>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-xl font-extrabold">{business.name}</h1>
          <p className="text-xs text-muted-foreground">
            {business.category} · 🕒 {business.schedule}
          </p>
          <p className="mt-1 text-xs font-semibold text-primary">
            Domicilio {cop(business.deliveryFee)}
          </p>
        </div>
      </div>

      {!business.active && (
        <p className="mt-3 rounded-xl bg-muted p-3 text-center text-xs font-semibold text-muted-foreground">
          Este negocio está pausado. Puedes ver la carta, pero no recibe pedidos ahora.
        </p>
      )}

      {menu.map((group) => (
        <section key={group.category} className="mt-6">
          <h2 className="mb-3 font-display text-lg font-bold">{group.category}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.items.map((item) => (
              <article key={item.id} className="surface-card p-4">
                <div className="flex gap-3">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-xl">
                    {item.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-sm font-bold">{item.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                    <p className="mt-2 text-sm font-extrabold text-primary">{cop(item.price)}</p>
                  </div>
                </div>

                {openId === item.id ? (
                  <div className="mt-3 space-y-3 border-t border-border pt-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold">Cantidad</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="size-8 rounded-lg border border-border font-bold"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{qty}</span>
                        <button
                          onClick={() => setQty((q) => q + 1)}
                          className="size-8 rounded-lg border border-border font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      placeholder="Nota especial (sin cebolla, término de la carne…)"
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-ring"
                    />
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
                        toast.success(`${item.name} agregado al carrito`);
                        setOpenId(null);
                        setQty(1);
                        setNote("");
                      }}
                      className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground disabled:opacity-50"
                    >
                      Agregar {cop(item.price * qty)}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setOpenId(item.id);
                      setQty(1);
                      setNote("");
                    }}
                    className="mt-3 w-full rounded-xl border border-primary py-2 text-xs font-bold text-primary"
                  >
                    Agregar al carrito
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}

      {menu.length === 0 && (
        <p className="surface-card mt-6 p-6 text-center text-sm text-muted-foreground">
          Este negocio aún no tiene productos cargados.
        </p>
      )}

      {itemCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur">
          <Link
            to="/checkout"
            className="mx-auto flex max-w-md items-center justify-between rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
          >
            <span>Ver carrito ({itemCount})</span>
            <span>Continuar →</span>
          </Link>
        </div>
      )}
    </main>
  );
}
