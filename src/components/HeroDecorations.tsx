import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Truck, ShieldCheck, Clock, Navigation, MapPin, Zap, CheckCircle2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckPickup, faTruckMoving, faTruck } from "@fortawesome/free-solid-svg-icons";

/**
 * AnimatedHeroVehicles:
 * Muestra una tarjeta animada interactiva con el radar de la central de Pitalito,
 * vehículos disponibles en patrulla y estado de disponibilidad en tiempo real.
 */
export function AnimatedHeroVehicles() {
  const [activeVehicleIndex, setActiveVehicleIndex] = useState(0);

  const vehicleHighlights = [
    {
      name: "Turbo 4.5 Toneladas",
      type: "Mudanzas Grandes",
      icon: faTruck,
      badge: "Carga Pesada",
      tag: "Trasteos de Casas & Locales",
      speed: "Disponible Hoy",
      color: "from-cyan-500 to-blue-600",
    },
    {
      name: "Camioneta Planchón / Estacas",
      type: "Muebles & Electrodomésticos",
      icon: faTruckPickup,
      badge: "Urbano & Rural",
      tag: "Neveras, Camas, Cajas",
      speed: "Despacho Inmediato",
      color: "from-blue-500 to-indigo-600",
    },
    {
      name: "Motocarro de Carga",
      type: "Acarreos Express",
      icon: faTruckMoving,
      badge: "Rápido & Económico",
      tag: "Cargas Medianas o Rápidas",
      speed: "Turno Activo",
      color: "from-emerald-400 to-teal-600",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveVehicleIndex((prev) => (prev + 1) % vehicleHighlights.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [vehicleHighlights.length]);

  const current = vehicleHighlights[activeVehicleIndex];

  return (
    <div className="relative w-full">
      {/* Radar de Despacho Nubex & Tarjeta Holográfica */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-black/50 backdrop-blur-xl border border-cyan-500/40 p-5 sm:p-6 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
        {/* Haz de luz de radar animado */}
        <div className="absolute -right-12 -top-12 size-44 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        {/* Encabezado de la central con pulso activo */}
        <div className="flex items-center justify-between gap-2 border-b border-cyan-500/20 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-80" />
              <span className="relative inline-flex size-3 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                Radar de Despacho
              </p>
              <p className="text-xs font-bold text-white flex items-center gap-1">
                <MapPin className="size-3 text-cyan-400" /> Pitalito y Rutas Sur del Huila
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-950/80 px-2.5 py-1 text-[9px] font-extrabold uppercase text-cyan-300 border border-cyan-500/40 shadow-sm">
            <Zap className="size-2.5 text-cyan-400 animate-bounce" /> Activo
          </span>
        </div>

        {/* Visualizador de Vehículo Rotativo con motion */}
        <div className="mt-4 relative min-h-[140px] flex flex-col justify-between">
          <motion.div
            key={activeVehicleIndex}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="rounded-xl bg-gradient-to-br from-slate-900/90 via-[#0a1820] to-[#0e2733] border border-cyan-500/30 p-3.5 shadow-inner"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${current.color} text-white shadow-lg shadow-cyan-500/20`}
                >
                  <FontAwesomeIcon icon={current.icon} className="text-lg" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    {current.badge}
                  </span>
                  <h4 className="text-sm font-black text-white mt-1">{current.name}</h4>
                  <p className="text-[11px] text-cyan-100/75">{current.type}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-cyan-500/20 flex items-center justify-between text-[10px]">
              <span className="text-slate-300 flex items-center gap-1">
                <Navigation className="size-3 text-cyan-400" />
                {current.tag}
              </span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                {current.speed}
              </span>
            </div>
          </motion.div>

          {/* Indicadores de vehículos disponibles */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {vehicleHighlights.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveVehicleIndex(i)}
                  aria-label={`Ver vehículo ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeVehicleIndex === i
                      ? "w-6 bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]"
                      : "w-2 bg-slate-700 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>

            <span className="text-[10px] text-cyan-300/80 font-semibold">
              Despacho Coordinado en Pitalito
            </span>
          </div>
        </div>

        {/* Micro Badges de Confianza con flotación suave */}
        <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-cyan-500/20 text-[10px]">
          <div className="flex items-center gap-1.5 text-cyan-200 bg-cyan-950/40 rounded-lg p-1.5 border border-cyan-500/20">
            <ShieldCheck className="size-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">Conductores Verificados</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-200 bg-cyan-950/40 rounded-lg p-1.5 border border-cyan-500/20">
            <Clock className="size-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">Atención 7 AM - 11 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * AnimatedHeroFloatingBadges:
 * Elementos flotantes decorativos con física continua para ambientar el hero.
 */
export function AnimatedHeroDecorations() {
  return (
    <>
      {/* Esferas de luz sutil flotantes */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
          opacity: [0.15, 0.28, 0.15],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-6 right-10 size-64 rounded-full bg-gradient-to-br from-cyan-400/20 via-[#00E5FF]/10 to-transparent blur-3xl pointer-events-none"
      />

      <motion.div
        animate={{
          y: [8, -8, 8],
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -bottom-10 left-12 size-56 rounded-full bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none"
      />
    </>
  );
}

/**
 * HeroKeyStatsRow:
 * Métricas destacadas del servicio con micro-animaciones al cargar.
 */
export function HeroKeyStatsRow() {
  const stats = [
    { number: "100%", label: "Cobertura Pitalito", sub: "Urbano & Veredas", icon: MapPin },
    { number: "4+", label: "Tipos de Vehículo", sub: "Motocarro a Camión", icon: Truck },
    { number: "Directo", label: "Contacto Oficial", sub: "Central WhatsApp", icon: Zap },
  ];

  return (
    <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-cyan-500/20 grid grid-cols-3 gap-2 sm:gap-4 text-left">
      {stats.map((st, i) => (
        <motion.div
          key={st.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 * i + 0.2 }}
          className="rounded-xl sm:rounded-2xl bg-black/30 border border-cyan-500/20 p-2.5 sm:p-3.5 backdrop-blur hover:border-cyan-400/40 transition-colors"
        >
          <div className="flex items-center gap-1.5 text-[#00E5FF] mb-0.5">
            <st.icon className="size-3 sm:size-3.5" />
            <span className="text-xs sm:text-base font-black tracking-tight text-white">
              {st.number}
            </span>
          </div>
          <p className="text-[10px] sm:text-xs font-bold text-cyan-200 truncate">{st.label}</p>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate hidden sm:block">
            {st.sub}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
