import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { NubexLogo } from "./NubexLogo";
import {
  Menu,
  X,
  Truck,
  Home,
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  ShieldCheck,
  MessageCircle,
  Package,
  Layers,
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuDrawer({ isOpen, onClose }: MobileMenuProps) {
  // Prevenir scroll en el fondo cuando el menú móvil está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const waContactUrl =
    "https://wa.me/573125964567?text=" +
    encodeURIComponent(
      "¡Hola Central Nubex! Quisiera información y cotización sobre un servicio de acarreo en Pitalito.",
    );

  const handleNavClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      {/* Backdrop con desenfoque suave */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer / Menú lateral deslizable */}
      <aside
        className="fixed inset-y-0 right-0 z-[101] flex w-full max-w-[320px] sm:max-w-sm flex-col bg-gradient-to-b from-[#0a1217] via-[#0e1c24] to-[#122530] border-l border-cyan-500/30 text-white shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal de navegación móvil"
      >
        {/* Cabecera del Menú Móvil */}
        <div className="flex items-center justify-between border-b border-border/80 px-4 py-3.5 bg-background/50 backdrop-blur">
          <Link to="/" onClick={handleNavClick} className="flex items-center">
            <NubexLogo size="sm" showSubtitle={false} categoryText="ACARREOS" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Indicador de Estado de la Central */}
        <div className="m-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 p-3 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-[#00E5FF]" />
              </span>
              <span className="text-[11px] font-bold text-cyan-200">
                Central Activa en Pitalito
              </span>
            </div>
            <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[9px] font-extrabold uppercase text-cyan-300">
              Despacho Hoy
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Lunes a Domingo: 7:00 AM – 11:00 PM
          </p>
        </div>

        {/* Lista de Navegación Móvil */}
        <div className="flex-1 px-3.5 py-2 space-y-1.5">
          <p className="px-2 text-[10px] font-black uppercase tracking-wider text-cyan-400/90">
            Navegación Rápida
          </p>

          <Link
            to="/"
            onClick={handleNavClick}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-white transition-all bg-white/5 border border-white/5 hover:border-cyan-400/40 hover:bg-cyan-950/40"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
                <Home className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Inicio</p>
                <p className="text-[10px] text-muted-foreground font-normal">Página principal</p>
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>

          {/* Botón Destacado: Pide tu Acarreo */}
          <a
            href="#pedir-acarreo"
            onClick={handleNavClick}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 hover:bg-cyan-500/30"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-400 to-[#00E5FF] text-black shadow-sm">
                <Truck className="size-4" />
              </div>
              <div>
                <p className="text-xs font-black text-cyan-200">Pide tu Acarreo</p>
                <p className="text-[10px] text-cyan-300/80 font-medium">Cotización en 3 pasos</p>
              </div>
            </div>
            <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-[9px] font-black text-black">
              Iniciar
            </span>
          </a>

          <a
            href="#pedir-acarreo"
            onClick={handleNavClick}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/5"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-muted-foreground">
                <Layers className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Tipos de Vehículos</p>
                <p className="text-[10px] text-muted-foreground font-normal">
                  Motocarros, Turbos, Camionetas
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </a>

          <a
            href="#contacto"
            onClick={handleNavClick}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/5"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-muted-foreground">
                <MapPin className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Zonas y Cobertura</p>
                <p className="text-[10px] text-muted-foreground font-normal">
                  Pitalito, veredas y nacional
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </a>

          <a
            href="#contacto"
            onClick={handleNavClick}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/5"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-muted-foreground">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Información de la Central</p>
                <p className="text-[10px] text-muted-foreground font-normal">
                  Garantía, conductores y base
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </a>
        </div>

        {/* Sección de Contacto Directo Móvil */}
        <div className="p-3.5 border-t border-border/80 bg-black/40 space-y-2">
          <p className="px-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            Atención Inmediata
          </p>

          <a
            href={waContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleNavClick}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2.5 text-xs font-black transition-all active:scale-98 shadow-md shadow-emerald-500/20"
          >
            <MessageCircle className="size-4" />
            <span>WhatsApp Central (+57 312 596 4567)</span>
          </a>

          <a
            href="tel:+573125964567"
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white/5 hover:bg-white/10 text-white px-4 py-2 text-xs font-bold transition-all"
          >
            <Phone className="size-3.5 text-cyan-400" />
            <span>Llamar a Despacho</span>
          </a>

          <p className="text-center text-[10px] text-muted-foreground pt-1">
            Nubex Central de Acarreos · Pitalito, Huila
          </p>
        </div>
      </aside>
    </div>
  );
}

/**
 * Barra inferior fija para dispositivos móviles (Bottom Navigation Bar)
 * Permite acceso con el pulgar a las funciones clave
 */
export function MobileBottomNavigation({ onOpenMenu }: { onOpenMenu: () => void }) {
  const waContactUrl =
    "https://wa.me/573125964567?text=" +
    encodeURIComponent(
      "¡Hola Central Nubex! Quisiera información sobre un servicio de acarreo en Pitalito.",
    );

  return (
    <nav
      aria-label="Navegación inferior móvil"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0c181e]/95 backdrop-blur-lg border-t border-cyan-500/30 px-3 py-1.5 shadow-2xl safe-area-inset-bottom"
    >
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        {/* 1. Inicio */}
        <Link
          to="/"
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-muted-foreground hover:text-cyan-300 active:scale-95 transition-all text-center min-w-[56px]"
        >
          <Home className="size-4 mb-0.5" />
          <span className="text-[10px] font-bold">Inicio</span>
        </Link>

        {/* 2. Botón Destacado: Pide tu Acarreo */}
        <a
          href="#pedir-acarreo"
          className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-400 via-[#00E5FF] to-[#00B4D8] text-black px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-cyan-500/30 active:scale-95 transition-all"
        >
          <Truck className="size-4" />
          <span>Pide Acarreo</span>
        </a>

        {/* 3. WhatsApp Directo */}
        <a
          href={waContactUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-emerald-400 hover:text-emerald-300 active:scale-95 transition-all text-center min-w-[56px]"
        >
          <MessageCircle className="size-4 mb-0.5" />
          <span className="text-[10px] font-bold">WhatsApp</span>
        </a>

        {/* 4. Abrir Menú Móvil */}
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menú completo"
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-muted-foreground hover:text-white active:scale-95 transition-all text-center min-w-[56px]"
        >
          <Menu className="size-4 mb-0.5 text-cyan-400" />
          <span className="text-[10px] font-bold text-white">Menú</span>
        </button>
      </div>
    </nav>
  );
}
