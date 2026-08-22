import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { cop } from "@/lib/format";
import { DELIVERY_FEE, type Business, type Product } from "@/data/demo";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de administración | Domicilios Nubex" },
      {
        name: "description",
        content:
          "Gestiona restaurantes aliados y sus productos: crear, editar, pausar o eliminar en Domicilios Nubex Pitalito.",
      },
      { property: "og:title", content: "Panel de administración | Domicilios Nubex" },
      {
        property: "og:description",
        content: "Administra negocios y menús de la plataforma de domicilios de Pitalito.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const emptyBusiness = (): Business => ({
  id: `b${Date.now()}`,
  slug: "",
  name: "",
  category: "",
  emoji: "🍽️",
  color: "var(--brand-1)",
  schedule: "",
  phone: "",
  active: true,
  deliveryFee: DELIVERY_FEE,
});

const emptyProduct = (businessId: string): Product => ({
  id: `p${Date.now()}`,
  businessId,
  category: "",
  name: "",
  description: "",
  price: 0,
  emoji: "🍽️",
  active: true,
});

function Admin() {
  const {
    businesses,
    products,
    saveBusiness,
    removeBusiness,
    toggleBusiness,
    saveProduct,
    removeProduct,
  } = useStore();
  const [tab, setTab] = useState<"negocios" | "productos">("negocios");
  const [bForm, setBForm] = useState<Business | null>(null);
  const [pForm, setPForm] = useState<Product | null>(null);
  const [selected, setSelected] = useState(businesses[0]?.id ?? "");

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      <h1 className="mt-6 text-2xl font-extrabold">Panel de administración</h1>
      <p className="text-sm text-muted-foreground">
        Demo local: los cambios se guardan en este navegador.
      </p>

      <div className="mt-4 flex gap-2">
        {(["negocios", "productos"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-xs font-bold capitalize ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "negocios" && (
        <section className="mt-4 space-y-3">
          <button
            onClick={() => setBForm(emptyBusiness())}
            className="w-full rounded-xl border border-dashed border-primary py-3 text-xs font-bold text-primary"
          >
            + Crear restaurante
          </button>

          {bForm && (
            <div className="surface-card space-y-2 p-4">
              <h2 className="font-display text-sm font-bold">Datos del negocio</h2>
              <Row label="Nombre" value={bForm.name} onChange={(v) => setBForm({ ...bForm, name: v })} />
              <Row
                label="Categoría"
                value={bForm.category}
                onChange={(v) => setBForm({ ...bForm, category: v })}
              />
              <Row
                label="Horario"
                value={bForm.schedule}
                onChange={(v) => setBForm({ ...bForm, schedule: v })}
              />
              <Row
                label="WhatsApp del negocio"
                value={bForm.phone}
                onChange={(v) => setBForm({ ...bForm, phone: v })}
              />
              <Row label="Logo (emoji)" value={bForm.emoji} onChange={(v) => setBForm({ ...bForm, emoji: v })} />
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    if (!bForm.name.trim()) return toast.error("El nombre es obligatorio");
                    saveBusiness({ ...bForm, slug: bForm.slug || slugify(bForm.name) });
                    setBForm(null);
                    toast.success("Negocio guardado");
                  }}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setBForm(null)}
                  className="rounded-xl border border-border px-4 text-xs font-bold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {businesses.map((b) => (
            <div key={b.id} className="surface-card flex items-center gap-3 p-4">
              <span className="grid size-11 place-items-center rounded-xl bg-secondary text-xl">
                {b.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{b.name}</p>
                <p className="text-xs text-muted-foreground">
                  {b.category} · {b.schedule || "sin horario"} · {b.active ? "Activo" : "Pausado"}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <IconBtn onClick={() => setBForm(b)}>✏️</IconBtn>
                <IconBtn onClick={() => toggleBusiness(b.id)}>{b.active ? "⏸️" : "▶️"}</IconBtn>
                <IconBtn
                  onClick={() => {
                    removeBusiness(b.id);
                    toast("Negocio eliminado");
                  }}
                >
                  🗑️
                </IconBtn>
              </div>
            </div>
          ))}
        </section>
      )}

      {tab === "productos" && (
        <section className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-bold">Restaurante</span>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={() => setPForm(emptyProduct(selected))}
            className="w-full rounded-xl border border-dashed border-primary py-3 text-xs font-bold text-primary"
          >
            + Cargar producto
          </button>

          {pForm && (
            <div className="surface-card space-y-2 p-4">
              <h2 className="font-display text-sm font-bold">Producto</h2>
              <Row label="Nombre" value={pForm.name} onChange={(v) => setPForm({ ...pForm, name: v })} />
              <Row
                label="Descripción"
                value={pForm.description}
                onChange={(v) => setPForm({ ...pForm, description: v })}
              />
              <Row
                label="Categoría del menú"
                value={pForm.category}
                onChange={(v) => setPForm({ ...pForm, category: v })}
              />
              <Row
                label="Precio (COP)"
                value={String(pForm.price)}
                onChange={(v) => setPForm({ ...pForm, price: Number(v.replace(/\D/g, "")) || 0 })}
              />
              <Row label="Foto (emoji)" value={pForm.emoji} onChange={(v) => setPForm({ ...pForm, emoji: v })} />
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    if (!pForm.name.trim() || !pForm.category.trim())
                      return toast.error("Nombre y categoría son obligatorios");
                    saveProduct({ ...pForm, businessId: pForm.businessId || selected });
                    setPForm(null);
                    toast.success("Producto guardado");
                  }}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setPForm(null)}
                  className="rounded-xl border border-border px-4 text-xs font-bold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {products
            .filter((p) => p.businessId === selected)
            .map((p) => (
              <div key={p.id} className="surface-card flex items-center gap-3 p-4">
                <span className="grid size-11 place-items-center rounded-xl bg-secondary text-xl">
                  {p.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.category} · {cop(p.price)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <IconBtn onClick={() => setPForm(p)}>✏️</IconBtn>
                  <IconBtn onClick={() => saveProduct({ ...p, active: !p.active })}>
                    {p.active ? "⏸️" : "▶️"}
                  </IconBtn>
                  <IconBtn
                    onClick={() => {
                      removeProduct(p.id);
                      toast("Producto eliminado");
                    }}
                  >
                    🗑️
                  </IconBtn>
                </div>
              </div>
            ))}
        </section>
      )}
    </main>
  );
}

function Row({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

function IconBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="grid size-9 place-items-center rounded-lg border border-border text-sm"
    >
      {children}
    </button>
  );
}
