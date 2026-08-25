import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, Truck, MessageCircle } from "lucide-react";
import { scrollToSection } from "./PageTransition";

export function FloatingQuickNavigation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 380) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    window.history.pushState(null, "", window.location.pathname);
  };

  const waContactUrl =
    "https://wa.me/573125964567?text=" +
    encodeURIComponent(
      "¡Hola Central Nubex! Quisiera cotizar un servicio de acarreo o transporte en Pitalito.",
    );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto"
        >
          {/* Botón flotante rápido para pedir acarreo (sólo desktop/tablet) */}
          <a
            href="#pedir-acarreo"
            onClick={(e) => scrollToSection(e, "pedir-acarreo")}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-[#00E5FF] to-[#00AEFF] px-4 py-2.5 text-xs font-black text-black shadow-xl shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95 group"
          >
            <Truck className="size-4 group-hover:animate-bounce" />
            <span>Pide tu Acarreo</span>
          </a>

          <div className="flex items-center gap-2">
            {/* WhatsApp Quick Floating (desktop) */}
            <a
              href={waContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex size-11 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-xl shadow-emerald-500/30 transition-all hover:scale-110 active:scale-95"
              title="WhatsApp Central Nubex"
            >
              <MessageCircle className="size-5" />
            </a>

            {/* Scroll To Top Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              aria-label="Volver arriba"
              className="flex size-10 sm:size-11 items-center justify-center rounded-full bg-slate-900/90 hover:bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 backdrop-blur shadow-xl shadow-black/50 transition-colors"
            >
              <ArrowUp className="size-5" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
