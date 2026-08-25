import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VehicleIllustration } from "./VehicleIllustrations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faTruckFast,
  faRoute,
  faPaperPlane,
  faCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

interface StepProgressBarProps {
  currentStep: 1 | 2 | 3;
  onStepClick: (step: 1 | 2 | 3) => void;
  isStep2Unlocked: boolean;
  isStep3Unlocked: boolean;
}

/**
 * Barra de progreso interactiva y animada con cálculos porcentuales,
 * transiciones suaves, haz de luz y estados completados.
 */
export function StepProgressBar({
  currentStep,
  onStepClick,
  isStep2Unlocked,
  isStep3Unlocked,
}: StepProgressBarProps) {
  // Cálculo porcentual del progreso: Paso 1 = 33%, Paso 2 = 66%, Paso 3 = 100%
  const progressPercent = currentStep === 1 ? 33.3 : currentStep === 2 ? 66.6 : 100;

  const steps = [
    {
      step: 1 as const,
      title: "Vehículo",
      subtitle: "Tipo y Capacidad",
      icon: faTruckFast,
      isUnlocked: true,
      isCompleted: isStep2Unlocked,
    },
    {
      step: 2 as const,
      title: "Ruta y Fecha",
      subtitle: "Origen y Destino",
      icon: faRoute,
      isUnlocked: isStep2Unlocked,
      isCompleted: isStep3Unlocked,
    },
    {
      step: 3 as const,
      title: "Carga y Envío",
      subtitle: "Detalles y WhatsApp",
      icon: faPaperPlane,
      isUnlocked: isStep3Unlocked,
      isCompleted: false,
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 sm:mb-10 px-2">
      {/* Barra de progreso global animada */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#00E5FF]" />
            </span>
            <span className="text-cyan-300">Progreso de tu Solicitud</span>
          </div>
          <span className="font-mono text-cyan-200 text-xs font-bold">
            {Math.round(progressPercent)}% Completado
          </span>
        </div>

        {/* Track principal */}
        <div className="relative h-2.5 sm:h-3 w-full overflow-hidden rounded-full bg-slate-900/90 border border-slate-700/60 shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-[#00E5FF] to-blue-500 shadow-lg shadow-cyan-500/50 relative overflow-hidden"
            initial={{ width: "33.3%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Haz de luz brillante que recorre la barra */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-24"
              animate={{ x: ["-100%", "400%"] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Tarjetas de pasos interactivas con animaciones */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {steps.map((item) => {
          const isActive = currentStep === item.step;
          const isDone = item.isCompleted && !isActive;

          return (
            <button
              key={item.step}
              type="button"
              disabled={!item.isUnlocked}
              onClick={() => item.isUnlocked && onStepClick(item.step)}
              className={`relative p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
                !item.isUnlocked
                  ? "border-slate-800 bg-slate-900/40 text-muted-foreground/50 opacity-60 cursor-not-allowed"
                  : isActive
                    ? "border-cyan-400 bg-cyan-950/70 ring-2 ring-cyan-400/40 shadow-xl shadow-cyan-950/60 cursor-pointer"
                    : isDone
                      ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300 hover:border-emerald-400/70 cursor-pointer"
                      : "border-slate-800 bg-card/60 text-muted-foreground hover:border-cyan-500/40 hover:bg-slate-800/40 cursor-pointer"
              }`}
            >
              {/* Resplandor suave activo */}
              {isActive && (
                <div className="absolute top-0 right-0 -mr-6 -mt-6 size-16 rounded-full bg-cyan-400/20 blur-xl pointer-events-none" />
              )}

              <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2">
                <span
                  className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                    isActive
                      ? "text-cyan-300"
                      : isDone
                        ? "text-emerald-400"
                        : "text-muted-foreground"
                  }`}
                >
                  Paso {item.step}
                </span>

                {/* Badge indicador */}
                <span
                  className={`size-5 sm:size-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-transform ${
                    isActive
                      ? "bg-cyan-400 text-black shadow-md shadow-cyan-400/30 scale-110"
                      : isDone
                        ? "bg-emerald-500 text-black shadow-sm"
                        : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isDone ? <FontAwesomeIcon icon={faCheck} className="text-[10px]" /> : item.step}
                </span>
              </div>

              <div>
                <p
                  className={`text-xs sm:text-sm font-bold truncate ${
                    isActive ? "text-white" : isDone ? "text-emerald-200" : "text-slate-300"
                  }`}
                >
                  {item.title}
                </p>
                <p className="text-[10px] text-muted-foreground hidden sm:block truncate mt-0.5">
                  {item.subtitle}
                </p>
              </div>

              {/* Barra inferior activa */}
              {isActive && (
                <motion.div
                  layoutId="activeStepIndicator"
                  className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-[#00E5FF]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Modal animado de carga y despacho:
 * Se muestra al hacer clic en "Enviar Solicitud", simulando la preparación del despacho,
 * validación de ruta y conexión directa con WhatsApp.
 */
interface DispatchLoadingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  vehicleType: "motocarro" | "camioneta" | "turbo" | "camion";
  vehicleTitle: string;
  origin: string;
  destination: string;
  requestCode: string;
}

export function DispatchLoadingModal({
  isOpen,
  onComplete,
  vehicleType,
  vehicleTitle,
  origin,
  destination,
  requestCode,
}: DispatchLoadingModalProps) {
  const [progress, setProgress] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  const phases = [
    { title: "Estructurando solicitud de acarreo...", desc: "Pitalito, Huila" },
    { title: "Verificando disponibilidad de vehículo...", desc: vehicleTitle },
    { title: "Asignando ruta y central de despacho...", desc: `${origin} → ${destination}` },
    { title: "¡Despacho listo! Abriendo WhatsApp...", desc: "Código " + requestCode },
  ];

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentPhaseIndex(0);
      return;
    }

    // Animación de progreso progresivo
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 450);
          return 100;
        }

        const next = prev + 5;
        if (next >= 25 && next < 55) setCurrentPhaseIndex(1);
        else if (next >= 55 && next < 85) setCurrentPhaseIndex(2);
        else if (next >= 85) setCurrentPhaseIndex(3);

        return next;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop desenfocado */}
        <motion.div
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal Card */}
        <motion.div
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-[#0e1c24] via-[#0a141a] to-[#080d11] p-6 sm:p-8 text-white shadow-2xl shadow-cyan-950/80 text-center"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Luz ambiental en cabecera */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-cyan-500/20 to-transparent pointer-events-none" />

          {/* Badge de estado */}
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-950/90 border border-cyan-400/40 px-3.5 py-1 text-xs font-bold text-cyan-300 mb-4 shadow-inner">
            <span className="size-2 rounded-full bg-[#00E5FF] animate-ping" />
            <span>Central Nubex Pitalito · Despacho en Proceso</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">Preparando tu Solicitud</h3>
          <p className="text-xs text-cyan-200/80 mt-1 max-w-md mx-auto">
            {phases[currentPhaseIndex].title}
          </p>

          {/* Pista animada con el vehículo en movimiento */}
          <div className="relative my-6 p-4 rounded-2xl bg-black/60 border border-cyan-500/30 overflow-hidden shadow-inner">
            {/* Fondo con líneas de carretera en movimiento */}
            <div className="absolute inset-0 flex items-center justify-around opacity-20 pointer-events-none">
              <div className="w-full h-0.5 border-b-2 border-dashed border-cyan-300" />
            </div>

            {/* Ilustración del vehículo que se desplaza y palpita suavemente */}
            <motion.div
              className="mx-auto w-36 sm:w-44 h-24 flex items-center justify-center relative z-10"
              animate={{
                x: [0, 4, -4, 0],
                y: [0, -2, 0],
              }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <VehicleIllustration type={vehicleType} />
            </motion.div>

            {/* Código de solicitud */}
            <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-cyan-300/80 border-t border-cyan-900/50 pt-2">
              <span>{vehicleTitle}</span>
              <span className="font-bold text-white bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                {requestCode}
              </span>
            </div>
          </div>

          {/* Barra de progreso de despacho */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-cyan-400" />
                <span>{phases[currentPhaseIndex].desc}</span>
              </span>
              <span className="font-mono text-cyan-300 font-black">{progress}%</span>
            </div>

            <div className="h-3 w-full rounded-full bg-slate-950 border border-cyan-500/30 overflow-hidden p-0.5 shadow-inner">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-[#00E5FF] to-emerald-400 shadow-md shadow-cyan-400/50 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground italic">
            Al completar el 100%, se abrirá tu WhatsApp oficial con todos los detalles listos para
            enviar.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/**
 * Indicador animado de verificación de ruta (para Paso 2)
 */
export function RouteVerificationBadge({
  scope,
  origin,
  destination,
}: {
  scope: string;
  origin: string;
  destination: string;
}) {
  const isFilled = origin.trim().length > 2 && destination.trim().length > 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 transition-all ${
        isFilled
          ? "bg-cyan-950/50 border-cyan-400/40 text-cyan-200"
          : "bg-slate-900/50 border-slate-800 text-muted-foreground"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`size-2 rounded-full ${
            isFilled ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
          }`}
        />
        <div>
          <p className="font-bold text-white text-[11px] sm:text-xs">
            {isFilled
              ? "✓ Ruta y trayecto estructurados"
              : "Ingresa origen y destino para continuar"}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Cobertura: <strong className="text-cyan-300 capitalize">{scope}</strong> · Pitalito &
            Rutas
          </p>
        </div>
      </div>

      {isFilled && (
        <span className="text-[10px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 px-2 py-0.5 rounded-full shrink-0">
          Listo para Paso 3
        </span>
      )}
    </motion.div>
  );
}
