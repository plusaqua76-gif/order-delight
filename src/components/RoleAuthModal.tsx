import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { NubexLogo } from "@/components/NubexLogo";
import type { AppUser } from "@/data/demo";

export function RoleAuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { currentUser, loginUser, logoutUser, users, setCurrentUserDirectly } = useStore();
  const [emailInput, setEmailInput] = useState("");
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      return toast.error("Ingresa tu correo electrónico registrado");
    }

    const res = loginUser(emailInput);
    if (res.success) {
      toast.success(res.message);
      onClose();
    } else {
      toast.error(res.message);
    }
  };

  const handleSendMagicAccess = () => {
    if (!emailInput.trim()) {
      return toast.error("Ingresa el correo para enviarte el enlace de acceso");
    }
    const clean = emailInput.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === clean);
    if (!found) {
      return toast.error(
        "Este correo no está registrado en el sistema. Solicita acceso a la Central.",
      );
    }

    setIsSendingLink(true);
    setTimeout(() => {
      setIsSendingLink(false);
      setMagicLinkSent(true);
      toast.success(`Enlace de acceso y cambio de clave enviado a ${emailInput}`);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="surface-card w-full max-w-md rounded-2xl border border-cyan-500/40 p-6 shadow-2xl bg-card">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <NubexLogo size="sm" showSubtitle={false} />
            <h3 className="font-display text-base font-black text-white">
              Acceso a Módulos por Rol
            </h3>
          </div>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg border border-border text-xs text-muted-foreground hover:bg-secondary hover:text-white"
          >
            ✕
          </button>
        </div>

        {currentUser ? (
          <div className="space-y-4 pt-2">
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/40 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Sesión Activa
              </span>
              <p className="text-sm font-bold text-white">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-cyan-500/20 px-2 py-0.5 text-xs font-bold text-cyan-300">
                <span>Rol:</span>
                <span className="uppercase">{currentUser.role}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  logoutUser();
                  toast("Sesión cerrada");
                }}
                className="flex-1 rounded-xl border border-rose-500/40 bg-rose-950/30 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-950/60"
              >
                Cerrar Sesión
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-cyan-500 py-2.5 text-xs font-black text-black"
              >
                Ir a mi Módulo
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">
              Ingresa con tu correo corporativo asignado para ingresar a tu módulo de{" "}
              <strong>Super Administrador</strong>, <strong>Restaurante Aliado</strong> o{" "}
              <strong>Domiciliario</strong>.
            </p>

            <form onSubmit={handleLogin} className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-muted-foreground">
                  Correo Electrónico
                </span>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="ej: plusaqua76@gmail.com"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-500 py-3 text-xs font-black text-black shadow-lg hover:bg-cyan-400 transition-colors"
              >
                Ingresar al Módulo
              </button>
            </form>

            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">¿Nuevo usuario o restablecer clave?</span>
                <button
                  type="button"
                  onClick={handleSendMagicAccess}
                  disabled={isSendingLink}
                  className="font-bold text-cyan-400 hover:underline"
                >
                  {isSendingLink ? "Enviando..." : "Enviar enlace al correo"}
                </button>
              </div>

              {magicLinkSent && (
                <div className="mt-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-2.5 text-xs text-emerald-300">
                  ✨ Enlace de acceso y cambio de clave enviado. Revisa tu bandeja de entrada de{" "}
                  <strong>{emailInput}</strong>.
                </div>
              )}
            </div>

            {/* Accesos rápidos de prueba de roles */}
            <div className="mt-4 rounded-xl border border-border/80 bg-background/50 p-3 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Selección Rápida de Roles para Probar:
              </span>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                {users.slice(0, 3).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setCurrentUserDirectly(u);
                      toast.success(`Ingresaste como ${u.name} (${u.role.toUpperCase()})`);
                      onClose();
                    }}
                    className="flex flex-col items-start rounded-lg border border-border bg-card p-2 text-left hover:border-cyan-400 hover:bg-secondary transition-colors"
                  >
                    <span className="text-[10px] font-bold text-cyan-300 uppercase">{u.role}</span>
                    <span className="text-xs font-semibold text-white truncate max-w-full">
                      {u.name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
