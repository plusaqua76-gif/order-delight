import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { useRouterState } from "@tanstack/react-router";

/**
 * TopPageProgressBar:
 * Barra delgada de progreso neon al tope de la pantalla que se sincroniza con el scroll
 * y muestra feedback visual durante la navegación.
 */
export function TopPageProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 inset-x-0 z-[100] h-[3px] bg-transparent pointer-events-none">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-400 via-[#00E5FF] to-blue-500 origin-left shadow-[0_0_8px_#00E5FF]"
        style={{ scaleX }}
      />
    </div>
  );
}

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

/**
 * PageTransitionWrapper:
 * Transición cinematográfica y fluida entre rutas con fade y sutil elevación.
 */
export function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPath}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          duration: 0.25,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Hook para detectar la sección activa en pantalla durante el scroll
 */
export function useActiveSection(sectionIds: string[], defaultSection = "") {
  const [activeSection, setActiveSection] = useState<string>(defaultSection);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const sectionId = sectionIds[i];
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionId);
            return;
          }
        }
      }

      if (window.scrollY < 200) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  return activeSection;
}

/**
 * Función para realizar scroll suave con ajuste para la cabecera fija
 */
export function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, targetId: string) {
  e.preventDefault();
  const element = document.getElementById(targetId);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    // Actualizar hash en URL sin salto brusco
    window.history.pushState(null, "", `#${targetId}`);
  }
}
