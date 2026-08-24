import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NubexLogo } from "@/components/NubexLogo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Nubex Central de Acarreos | Motocarros, Camionetas, Turbos y Camiones en Pitalito",
      },
      {
        name: "description",
        content:
          "Central oficial de acarreos y mudanzas en Pitalito, Huila. Cotiza en 3 pasos: Selecciona tu vehículo, indica tu ruta y envía tu solicitud directa por WhatsApp.",
      },
      {
        property: "og:title",
        content: "Nubex Central de Acarreos · Pitalito, Huila",
      },
      {
        property: "og:description",
        content:
          "Solicita tu acarreo paso a paso: Motocarro, Camioneta, Turbo o Camión. Atención directa por WhatsApp.",
      },
    ],
  }),
  component: Home,
});

const CENTRAL_PHONE = "573125964567";

type VehicleType = "motocarro" | "camioneta" | "turbo" | "camion";
type RouteScope = "urbano" | "intermunicipal" | "nacional";

interface VehicleOption {
  id: VehicleType;
  title: string;
  badge: string;
  badgeColor: string;
  icon: string;
  capacity: string;
  dimensions: string;
  idealFor: string;
}

const VEHICLES: VehicleOption[] = [
  {
    id: "motocarro",
    title: "Motocarro / Motocarguero",
    badge: "Económico & Rápido",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: "🛵",
    capacity: "Hasta 350 kg",
    dimensions: "Platón 1.4m x 1.1m",
    idealFor: "Cargas pequeñas, compras de ferretería, electrodomésticos individuales o cajas.",
  },
  {
    id: "camioneta",
    title: "Camioneta Platón / Estacas",
    badge: "Más Solicitado",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    icon: "🛻",
    capacity: "Hasta 1.2 Toneladas",
    dimensions: "Estacas 2.2m x 1.6m",
    idealFor: "Muebles de hogar, camas, neveras, lavadoras, materiales y trasteos medianos.",
  },
  {
    id: "turbo",
    title: "Camión Turbo (NHR / NKR)",
    badge: "Mudanzas Completas",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: "🚛",
    capacity: "De 2.5 a 4.5 Toneladas",
    dimensions: "Furgón / Carrocería 4.5m",
    idealFor: "Mudanzas completas de casa o apartamento, locales comerciales y mercancía.",
  },
  {
    id: "camion",
    title: "Camión Grande / Sencillo",
    badge: "Carga Pesada & Nacional",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    icon: "🚚",
    capacity: "De 5 a 10 Toneladas",
    dimensions: "Carrocería 6m a 7.5m",
    idealFor: "Mudanzas a otras ciudades, productos agrícolas, café, materiales pesados.",
  },
];

export function Home() {
  // Current active step (1: Vehicle, 2: Route & Location, 3: Cargo & Contact)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [routeScope, setRouteScope] = useState<RouteScope>("urbano");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [floorOrigin, setFloorOrigin] = useState("1");
  const [floorDest, setFloorDest] = useState("1");
  const [hasElevator, setHasElevator] = useState<"si" | "no">("no");
  const [targetDate, setTargetDate] = useState<"hoy" | "manana" | "programado">("hoy");

  const [itemsDescription, setItemsDescription] = useState("");
  const [needHelpers, setNeedHelpers] = useState<"no" | "1" | "2" | "mas">("no");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const activeVehicle = VEHICLES.find((v) => v.id === selectedVehicle);

  // Selection of vehicle advances to Step 2
  const handleSelectVehicle = (vehicleId: VehicleType) => {
    setSelectedVehicle(vehicleId);
    setIsSubmitted(false);
    setCurrentStep(2);
  };

  // Validation to proceed to Step 3
  const handleProceedToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) {
      return;
    }
    setCurrentStep(3);
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !activeVehicle ||
      !origin.trim() ||
      !destination.trim() ||
      !itemsDescription.trim() ||
      !clientName.trim()
    ) {
      return;
    }

    const scopeLabels: Record<RouteScope, string> = {
      urbano: "🏙️ Urbano (Dentro del casco de Pitalito)",
      intermunicipal: "🌄 Intermunicipal / Veredal (Bruselas, San Agustín, Timaná, etc.)",
      nacional: "🇨🇴 Nacional (Neiva, Bogotá, Cali, Medellín, etc.)",
    };

    const helpersLabels: Record<string, string> = {
      no: "❌ Solo Conductor (Sin cargadores)",
      "1": "🙋‍♂️ 1 Ayudante de cargue/descargue",
      "2": "🙋‍♂️🙋‍♂️ 2 Ayudantes de cargue/descargue",
      mas: "👥 3 o más ayudantes",
    };

    const dateLabels: Record<string, string> = {
      hoy: "⚡ Hoy mismo (Servicio Inmediato)",
      manana: "📅 Para el día de Mañana",
      programado: "🗓️ Servicio Programado (Próximos días)",
    };

    const requestCode = `AC-${Math.floor(1000 + Math.random() * 9000)}`;

    const lines = [
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📦 *SOLICITUD DE ACARREO · CENTRAL NUBEX*`,
      `📍 *Pitalito, Huila · Valle de Laboyos*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📌 *Solicitud Nº:* ${requestCode}`,
      ``,
      `🚚 *VEHÍCULO SOLICITADO:*`,
      `*${activeVehicle.icon} ${activeVehicle.title}*`,
      `• Capacidad: ${activeVehicle.capacity}`,
      ``,
      `🗺️ *TRAYECTO:*`,
      `• Tipo de Servicio: ${scopeLabels[routeScope]}`,
      `• 📍 *Recogida (Origen):* ${origin.trim() || "Por definir"} (Piso ${floorOrigin})`,
      `• 🏁 *Entrega (Destino):* ${destination.trim() || "Por definir"} (Piso ${floorDest})`,
      `• 🏢 *Ascensor:* ${hasElevator === "si" ? "Sí cuenta con ascensor" : "No (Por escaleras)"}`,
      `• 🕒 *Fecha requerida:* ${dateLabels[targetDate]}`,
      ``,
      `📦 *DESCRIPCIÓN DE LA CARGA / TRASTEO:*`,
      `${itemsDescription.trim() || "Carga general / Trasteo"}`,
      ``,
      `💪 *PERSONAL DE CARGUE:*`,
      `• ${helpersLabels[needHelpers]}`,
      ``,
      `👤 *DATOS DE CONTACTO:*`,
      `• Nombre: ${clientName.trim() || "Cliente Nubex"}`,
      clientPhone.trim() ? `• Teléfono: ${clientPhone.trim()}` : undefined,
      additionalNotes.trim() ? `• 📝 Observaciones: ${additionalNotes.trim()}` : undefined,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `💬 *¡Hola Central Nubex! Acabo de enviar mi solicitud para pedir el acarreo. Quedo atento a la confirmación.*`,
    ].filter((l): l is string => l !== undefined);

    const message = lines.join("\n");
    const waLink = `https://wa.me/${CENTRAL_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(waLink, "_blank");

    // Limpiar completamente el formulario y restablecer al Paso 1
    setSelectedVehicle(null);
    setRouteScope("urbano");
    setOrigin("");
    setDestination("");
    setFloorOrigin("1");
    setFloorDest("1");
    setHasElevator("no");
    setTargetDate("hoy");
    setItemsDescription("");
    setNeedHelpers("no");
    setClientName("");
    setClientPhone("");
    setAdditionalNotes("");
    setCurrentStep(1);
    setIsSubmitted(true);
  };

  return (
    <main className="mx-auto max-w-5xl px-3.5 sm:px-6 pb-16 sm:pb-20">
      {/* 1. HERO BANNER PRINCIPAL */}
      <section className="relative overflow-hidden mt-3 sm:mt-6 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-cyan-500/30 bg-gradient-to-br from-[#0c181e] via-[#142d3a] to-[#1d4659] text-white shadow-2xl shadow-cyan-950/50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-cyan-300 border border-cyan-400/30 shadow-inner">
              <span className="size-2 rounded-full bg-[#00E5FF] animate-ping" />
              <span>Pitalito · Huila · Central de Despacho Activa</span>
            </div>

            <h1 className="mt-3 sm:mt-4 text-2xl sm:text-4xl lg:text-5xl font-black leading-[1.15] text-white tracking-tight">
              Central de{" "}
              <span className="bg-gradient-to-r from-white via-cyan-200 to-[#38BDF8] bg-clip-text text-transparent">
                Acarreos y Mudanzas
              </span>{" "}
              en Pitalito
            </h1>

            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-cyan-100/90 leading-relaxed max-w-xl">
              Coordinamos tu acarreo o trasteo con el vehículo exacto para tu carga:{" "}
              <strong className="text-white font-extrabold">
                Motocarros, Camionetas, Turbos y Camiones
              </strong>
              . Servicio urbano en Pitalito, veredas y rutas intermunicipales o nacionales.
            </p>

            <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3">
              <a
                href="#pedir-acarreo"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-[#00B4D8] px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-black text-black shadow-lg shadow-cyan-400/25 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto text-center"
              >
                <span>Pide tu Acarreo Ahora</span>
                <span className="text-base">↓</span>
              </a>

              <a
                href="#pedir-acarreo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/40 bg-black/40 backdrop-blur px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-white/10 w-full sm:w-auto text-center"
              >
                <span>Iniciar Proceso de Solicitud</span>
                <span>🚚</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-black/40 backdrop-blur-md border border-cyan-400/30 shadow-2xl shrink-0 w-full lg:w-72 text-center">
            <NubexLogo size="lg" subtitleText="Pitalito · Huila" />
            <div className="mt-4 sm:mt-5 w-full rounded-2xl bg-cyan-950/70 border border-cyan-500/40 p-3 text-center shadow-inner">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Central de Despacho
              </p>
              <p className="text-xs sm:text-sm font-bold text-white mt-1">
                Línea Oficial de Despacho
              </p>
              <p className="text-[10px] text-cyan-200/70 mt-1">
                Completa los 3 pasos para contactar y coordinar tu servicio
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOLICITUD DE ACARREO PASO A PASO */}
      <section id="pedir-acarreo" className="mt-10 sm:mt-14 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 text-[11px] sm:text-xs font-bold text-cyan-300 mb-2">
            <span>⚡ Proceso Obligatorio de Despacho</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Pide tu Acarreo
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Completa los 3 pasos a continuación para estructurar los detalles de tu carga y
            comunicar tu solicitud directamente con la Central Nubex.
          </p>

          {isSubmitted && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-lg animate-in fade-in">
              <div className="flex items-center gap-2.5 text-left">
                <span className="text-lg">✅</span>
                <div>
                  <p className="font-bold text-white">¡Solicitud enviada a la Central Nubex!</p>
                  <p className="text-[11px] text-emerald-300/90">
                    Se ha abierto WhatsApp con todos los detalles y el formulario ha sido limpiado
                    para una nueva solicitud.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-emerald-400 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-emerald-800/40"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* STEPPER PROGRESS BAR */}
        <div className="mb-6 sm:mb-8 max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-4 text-center">
            {/* Step 1 Indicator */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all text-left flex flex-col justify-between ${
                currentStep === 1
                  ? "border-cyan-400 bg-cyan-950/60 ring-2 ring-cyan-400/30 text-white"
                  : selectedVehicle
                    ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300"
                    : "border-border bg-card/40 text-muted-foreground opacity-60"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1">
                <span className="font-black">Paso 1</span>
                <span>{selectedVehicle ? "✓" : "1"}</span>
              </div>
              <p className="text-[11px] sm:text-xs font-bold truncate">1. Vehículo</p>
            </button>

            {/* Step 2 Indicator */}
            <button
              type="button"
              disabled={!selectedVehicle}
              onClick={() => selectedVehicle && setCurrentStep(2)}
              className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all text-left flex flex-col justify-between ${
                currentStep === 2
                  ? "border-cyan-400 bg-cyan-950/60 ring-2 ring-cyan-400/30 text-white"
                  : origin && destination
                    ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300"
                    : "border-border bg-card/40 text-muted-foreground opacity-60"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1">
                <span className="font-black">Paso 2</span>
                <span>{origin && destination ? "✓" : "2"}</span>
              </div>
              <p className="text-[11px] sm:text-xs font-bold truncate">2. Ruta</p>
            </button>

            {/* Step 3 Indicator */}
            <button
              type="button"
              disabled={!origin || !destination}
              onClick={() => origin && destination && setCurrentStep(3)}
              className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all text-left flex flex-col justify-between ${
                currentStep === 3
                  ? "border-cyan-400 bg-cyan-950/60 ring-2 ring-cyan-400/30 text-white"
                  : "border-border bg-card/40 text-muted-foreground opacity-60"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1">
                <span className="font-black">Paso 3</span>
                <span>3</span>
              </div>
              <p className="text-[11px] sm:text-xs font-bold truncate">3. Carga</p>
            </button>
          </div>
        </div>

        {/* CONTAINER DINÁMICO SEGÚN EL PASO */}
        <div className="surface-card p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-cyan-500/30 shadow-2xl bg-card/90">
          {/* ============================================================ */}
          {/* PASO 1: SELECCIONA EL VEHÍCULO */}
          {/* ============================================================ */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/70">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-7 sm:size-8 place-items-center rounded-lg bg-cyan-400 text-black text-xs sm:text-sm font-black shadow-md shadow-cyan-500/20 shrink-0">
                    1
                  </span>
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-white">
                      Selecciona el Tipo de Vehículo
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      Haz clic en el vehículo adecuado para cargar el formulario de ruta
                    </p>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-cyan-400 uppercase tracking-wide">
                  Paso 1 de 3
                </span>
              </div>

              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {VEHICLES.map((veh) => {
                  const isSelected = selectedVehicle === veh.id;
                  return (
                    <button
                      key={veh.id}
                      type="button"
                      onClick={() => handleSelectVehicle(veh.id)}
                      className={`relative p-4 sm:p-5 rounded-xl sm:rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer group hover:scale-[1.01] sm:hover:scale-[1.02] active:scale-[0.99] ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-950/60 ring-2 ring-cyan-400/40 shadow-xl shadow-cyan-500/20"
                          : "border-border/80 bg-secondary/40 hover:border-cyan-500/60 hover:bg-secondary/70"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <span className="text-3xl sm:text-4xl drop-shadow group-hover:scale-110 transition-transform">
                            {veh.icon}
                          </span>
                          <span
                            className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg border ${veh.badgeColor}`}
                          >
                            {veh.badge}
                          </span>
                        </div>

                        <h4 className="font-display font-bold text-sm sm:text-base text-white">
                          {veh.title}
                        </h4>

                        <div className="mt-2 space-y-0.5 sm:space-y-1 text-xs">
                          <p className="font-bold text-cyan-300 flex items-center gap-1 text-[11px] sm:text-xs">
                            <span>⚖️</span> {veh.capacity}
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                            📐 {veh.dimensions}
                          </p>
                        </div>

                        <p className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs text-muted-foreground leading-snug border-t border-border/40 pt-2 sm:pt-2.5">
                          {veh.idealFor}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-5 pt-2.5 sm:pt-3 border-t border-border/50 flex items-center justify-between text-[11px] sm:text-xs">
                        <span className="font-black text-cyan-300 group-hover:underline">
                          Seleccionar →
                        </span>
                        <span className="text-sm sm:text-base">{isSelected ? "🔘" : "⚪"}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* PASO 2: TRAYECTO Y RUTA (Se carga tras elegir vehículo) */}
          {/* ============================================================ */}
          {currentStep === 2 && activeVehicle && (
            <form onSubmit={handleProceedToStep3} className="space-y-5 sm:space-y-6">
              {/* Header with selected vehicle badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-7 sm:size-8 place-items-center rounded-lg bg-cyan-400 text-black text-xs sm:text-sm font-black shadow-md shadow-cyan-500/20 shrink-0">
                    2
                  </span>
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-white">
                      Ruta, Ubicación y Fecha del Acarreo
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      Indica de dónde a dónde va el servicio para el vehículo seleccionado
                    </p>
                  </div>
                </div>

                {/* Selected vehicle summary button to change */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-950/70 border border-cyan-500/40 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-900/60 transition-colors w-fit"
                >
                  <span>
                    {activeVehicle.icon} {activeVehicle.title}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-bold underline">(Cambiar)</span>
                </button>
              </div>

              {/* Scope Selector */}
              <div>
                <label className="block text-xs font-bold text-cyan-200 mb-2">
                  🗺️ Tipo de Trayecto / Cobertura
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {[
                    {
                      id: "urbano" as RouteScope,
                      label: "🏙️ Urbano Pitalito",
                      desc: "Casco Urbano y Barrios",
                    },
                    {
                      id: "intermunicipal" as RouteScope,
                      label: "🌄 Intermunicipal / Veredas",
                      desc: "Bruselas, San Agustín, Timaná, etc.",
                    },
                    {
                      id: "nacional" as RouteScope,
                      label: "🇨🇴 Rutas Nacionales",
                      desc: "Neiva, Bogotá, Cali, Medellín, etc.",
                    },
                  ].map((scope) => (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => setRouteScope(scope.id)}
                      className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl text-left border text-xs transition-all cursor-pointer ${
                        routeScope === scope.id
                          ? "border-cyan-400 bg-cyan-500/20 text-white ring-1 ring-cyan-400/30"
                          : "border-border bg-secondary/30 text-muted-foreground hover:text-white hover:bg-secondary/60"
                      }`}
                    >
                      <p className="font-display font-bold text-xs sm:text-sm text-white">
                        {scope.label}
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-cyan-200/80 mt-0.5">
                        {scope.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Origins and Destinations */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-cyan-200">
                    📍 Punto de Recogida (Origen) *
                  </label>
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Ej: Barrio Cálamo, Calle 5 # 4-20 / Pitalito"
                    className="w-full rounded-xl border border-border bg-card px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-muted-foreground/60 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-1">
                    <span>Piso de salida:</span>
                    <select
                      value={floorOrigin}
                      onChange={(e) => setFloorOrigin(e.target.value)}
                      className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-white outline-none focus:border-cyan-400"
                    >
                      <option value="1">1er Piso (Planta baja)</option>
                      <option value="2">2do Piso</option>
                      <option value="3">3er Piso</option>
                      <option value="4+">4to Piso o superior</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-cyan-200">
                    🏁 Punto de Entrega (Destino) *
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Ej: Barrio Los Pinos / Corregimiento Bruselas / Neiva"
                    className="w-full rounded-xl border border-border bg-card px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-muted-foreground/60 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-1">
                    <span>Piso de llegada:</span>
                    <select
                      value={floorDest}
                      onChange={(e) => setFloorDest(e.target.value)}
                      className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-white outline-none focus:border-cyan-400"
                    >
                      <option value="1">1er Piso (Planta baja)</option>
                      <option value="2">2do Piso</option>
                      <option value="3">3er Piso</option>
                      <option value="4+">4to Piso o superior</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Target Date & Elevator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                    🕒 ¿Para cuándo requieres el acarreo?
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {[
                      { id: "hoy" as const, label: "⚡ Hoy (Urgente)" },
                      { id: "manana" as const, label: "📅 Mañana" },
                      { id: "programado" as const, label: "🗓️ Otra fecha" },
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setTargetDate(d.id)}
                        className={`py-2 px-1.5 sm:px-2 rounded-xl border text-[10px] sm:text-[11px] font-bold text-center transition-all cursor-pointer ${
                          targetDate === d.id
                            ? "border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-sm"
                            : "border-border bg-secondary/30 text-muted-foreground hover:text-white"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                    🏢 ¿Cuenta con ascensor para cargue/descargue?
                  </label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 sm:gap-2">
                    {[
                      { id: "no" as const, label: "❌ No (Por escaleras)" },
                      { id: "si" as const, label: "🛗 Sí con ascensor" },
                    ].map((eOpt) => (
                      <button
                        key={eOpt.id}
                        type="button"
                        onClick={() => setHasElevator(eOpt.id)}
                        className={`py-2 px-2 sm:px-3 rounded-xl border text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer text-center ${
                          hasElevator === eOpt.id
                            ? "border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-sm"
                            : "border-border bg-secondary/30 text-muted-foreground hover:text-white"
                        }`}
                      >
                        {eOpt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botón Siguiente */}
              <div className="pt-4 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-t border-border/70">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-white transition-colors text-center w-full sm:w-auto"
                >
                  ← Volver a Vehículos
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-[#00AEFF] px-6 sm:px-7 py-3 text-xs sm:text-sm font-black text-black shadow-lg shadow-cyan-500/25 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer w-full sm:w-auto"
                >
                  <span>Continuar a Descripción de Carga →</span>
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* PASO 3: DESCRIPCIÓN DE LA CARGA & CONTACTO */}
          {/* ============================================================ */}
          {currentStep === 3 && activeVehicle && (
            <form onSubmit={handleSendWhatsApp} className="space-y-5 sm:space-y-6">
              {/* Header with summary of steps 1 & 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-7 sm:size-8 place-items-center rounded-lg bg-cyan-400 text-black text-xs sm:text-sm font-black shadow-md shadow-cyan-500/20 shrink-0">
                    3
                  </span>
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-white">
                      Descripción de la Carga & Contacto
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      Último paso: detalla los objetos a transportar y envía la cotización
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] sm:text-xs bg-cyan-950/70 border border-cyan-500/40 px-2.5 sm:px-3 py-1 rounded-xl text-cyan-300 font-bold">
                    {activeVehicle.icon} {activeVehicle.title}
                  </span>
                  <span className="text-[11px] sm:text-xs bg-secondary px-2.5 sm:px-3 py-1 rounded-xl text-muted-foreground truncate max-w-[200px] sm:max-w-none">
                    📍 {origin} → {destination}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-cyan-200 mb-1.5">
                    📦 ¿Qué objetos, muebles o mercancía vas a transportar? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={itemsDescription}
                    onChange={(e) => setItemsDescription(e.target.value)}
                    placeholder="Ej: Nevera grande, lavadora, cama doble, juego de sala y 6 cajas de ropa selladas..."
                    className="w-full rounded-xl border border-border bg-card px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-muted-foreground/60 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none transition-all"
                  />
                </div>

                {/* Helpers Selection */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                    💪 ¿Requieres ayudantes para cargar y descargar?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "no" as const, label: "❌ Solo Conductor" },
                      { id: "1" as const, label: "🙋‍♂️ 1 Ayudante" },
                      { id: "2" as const, label: "🙋‍♂️🙋‍♂️ 2 Ayudantes" },
                      { id: "mas" as const, label: "👥 3 o más" },
                    ].map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setNeedHelpers(h.id)}
                        className={`py-2 px-2 sm:px-3 rounded-xl border text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer text-center ${
                          needHelpers === h.id
                            ? "border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-sm"
                            : "border-border bg-secondary/30 text-muted-foreground hover:text-white"
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                      👤 Tu Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej: Carlos Gómez"
                      className="w-full rounded-xl border border-border bg-card px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-muted-foreground/60 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                      📞 Tu Teléfono de Contacto (Opcional)
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="Ej: 312 345 6789"
                      className="w-full rounded-xl border border-border bg-card px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-muted-foreground/60 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                    📝 Observaciones especiales (Cobijas de protección, horario específico, etc.)
                  </label>
                  <input
                    type="text"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Ej: Requerimos cobijas para proteger la madera del comedor..."
                    className="w-full rounded-xl border border-border bg-card px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-muted-foreground/60 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>

              {/* Acciones Finales: Volver o Enviar */}
              <div className="pt-4 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-t border-border/70">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-white transition-colors text-center w-full sm:w-auto"
                >
                  ← Volver a Ruta y Ubicación
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-[#00E5FF] to-[#00AEFF] px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-black text-black shadow-lg shadow-cyan-500/30 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer w-full sm:w-auto text-center"
                >
                  <span>Enviar Solicitud a la Central (+57 312 596 4567)</span>
                  <span className="text-base">💬</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 3. INFORMACIÓN DE LA CENTRAL */}
      <section id="contacto" className="mt-12 sm:mt-16 scroll-mt-24">
        <div className="surface-card p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-cyan-500/30 text-center max-w-3xl mx-auto shadow-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-300 mb-2">
            <span>📍 Pitalito · Huila</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Central de Despacho Nubex</h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Para coordinar y asignar el vehículo adecuado a tu servicio, completa el proceso de
            solicitud indicando origen, destino y tipo de carga.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#pedir-acarreo"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-[#00E5FF] to-[#00AEFF] px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-black text-black shadow-lg shadow-cyan-500/25 transition-transform hover:scale-[1.02] cursor-pointer w-full sm:w-auto"
            >
              <span>🚚 Iniciar Solicitud de Acarreo</span>
              <span className="text-base">→</span>
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs text-muted-foreground pt-6 border-t border-border/60">
            <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60">
              <p className="font-bold text-white mb-1">📍 Base Central</p>
              <p>Pitalito, Huila · Valle de Laboyos</p>
            </div>
            <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60">
              <p className="font-bold text-white mb-1">🕒 Disponibilidad</p>
              <p>Lunes a Domingo: 7:00 AM – 11:00 PM</p>
            </div>
            <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60">
              <p className="font-bold text-white mb-1">🚚 Flota de Vehículos</p>
              <p>Motocarros · Camionetas · Turbos · Camiones</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
